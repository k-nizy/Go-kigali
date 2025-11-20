"""
Real-time vehicle tracking API routes
Uses long-polling approach for compatibility
"""

from flask import Blueprint, request, jsonify, current_app, g
from app.extensions import db, limiter, cache
from models.vehicle import Vehicle
from models.stop import Stop
from datetime import datetime, timedelta
import math
import time
import logging
from functools import wraps

# Configure logging
logger = logging.getLogger(__name__)

def handle_errors(f):
    """Decorator to handle common errors and logging"""
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            start_time = time.time()
            result = f(*args, **kwargs)
            duration = (time.time() - start_time) * 1000  # in ms
            
            # Log slow requests
            if duration > 500:  # Log if request takes > 500ms
                logger.warning(
                    f"Slow request: {request.path} took {duration:.2f}ms",
                    extra={
                        'endpoint': request.path,
                        'duration_ms': duration,
                        'params': dict(request.args)
                    }
                )
                
            return result
            
        except ValueError as e:
            logger.error(f"Validation error: {str(e)}", exc_info=True)
            return jsonify({
                'status': 'error',
                'message': str(e) or 'Invalid request parameters',
                'code': 400
            }), 400
            
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}", exc_info=True)
            return jsonify({
                'status': 'error',
                'message': 'An unexpected error occurred',
                'code': 500
            }), 500
            
    return wrapper

realtime_bp = Blueprint('realtime', __name__)

@realtime_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify database connection and data"""
    try:
        # Check database connection
        db.session.execute('SELECT 1')
        
        # Check if vehicles table exists and has data
        from models.vehicle import Vehicle
        total_vehicles = db.session.query(Vehicle).count()
        active_vehicles = db.session.query(Vehicle).filter(Vehicle.is_active == True).count()
        
        return jsonify({
            'status': 'success',
            'database': 'connected',
            'vehicles': {
                'total': total_vehicles,
                'active': active_vehicles,
                'with_location': db.session.query(Vehicle).filter(
                    Vehicle.current_lat.isnot(None),
                    Vehicle.current_lng.isnot(None)
                ).count()
            }
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'database': 'connection_failed',
            'error': str(e)
        }), 500


def calculate_distance_km(lat1, lng1, lat2, lng2):
    """
    Calculate distance between two points using Haversine formula
    Returns distance in kilometers
    """
    R = 6371  # Earth's radius in kilometers
    
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlng / 2) ** 2)
    
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c
    
    return distance


def estimate_eta(distance_km, vehicle_type, traffic_factor=1.0):
    """
    Estimate arrival time based on distance and vehicle type
    Returns estimated time in minutes
    """
    speeds = {
        'bus': 30,      # 30 km/h average
        'taxi': 40,     # 40 km/h average
        'moto': 50      # 50 km/h average
    }
    
    base_speed = speeds.get(vehicle_type, 35)
    adjusted_speed = base_speed * traffic_factor
    
    eta_minutes = (distance_km / adjusted_speed) * 60
    return round(eta_minutes, 1)


def get_cache_key():
    """Generate a cache key based on request parameters"""
    args = request.args.copy()
    # Remove cache-busting parameter if present
    args.pop('_', None)
    return f"vehicles:{':'.join(f'{k}={v}' for k, v in sorted(args.items()))}"

@realtime_bp.route('/vehicles/realtime', methods=['GET'])
@limiter.limit("500 per minute")  # Increased limit for real-time data
@handle_errors
def get_realtime_vehicles():
    """
    Get real-time vehicle updates
    
    Query Parameters:
    - lat (float): Latitude (required)
    - lng (float): Longitude (required)
    - radius (float): Search radius in km (default: 5.0)
    - since (string): ISO timestamp of last update (optional)
    - type (string): Vehicle type filter (bus, taxi, moto) (optional)
    - _ (int): Cache-busting parameter (ignored)
    
    Response:
    {
        "status": "success",
        "data": {
            "vehicles": [
                {
                    "id": "vehicle_id",
                    "type": "bus|taxi|moto",
                    "lat": 0.0,
                    "lng": 0.0,
                    "heading": 0,
                    "speed": 0,
                    "updated_at": "ISO timestamp"
                }
            ],
            "timestamp": "ISO timestamp",
            "count": 0
        }
    }
    """
    """
    Get real-time vehicle updates since last timestamp
    Uses long-polling approach for real-time updates
    
    Query params:
    - lat: latitude (required)
    - lng: longitude (required)
    - radius: radius in km (default: 5.0)
    - since: ISO timestamp of last update (optional)
    - type: vehicle type filter (bus, taxi, moto) (optional)
    """
    # Parse and validate parameters
    try:
        lat = float(request.args.get('lat', 0))
        lng = float(request.args.get('lng', 0))
        radius = min(float(request.args.get('radius', 5.0)), 20.0)  # Cap radius at 20km
        vehicle_type = request.args.get('type')  # optional filter
        since_str = request.args.get('since')  # ISO timestamp
        
        # Validate coordinates
        if not (-90 <= lat <= 90) or not (-180 <= lng <= 180):
            raise ValueError("Invalid coordinates provided")
        
        if lat == 0 and lng == 0:
            return jsonify({'error': 'Valid coordinates are required'}), 400
        
        # Parse since timestamp if provided
        since = None
        if since_str:
            try:
                since = datetime.fromisoformat(since_str.replace('Z', '+00:00'))
                # Don't allow timestamps too far in the past to prevent abuse
                max_age = datetime.utcnow() - timedelta(days=1)
                if since < max_age:
                    since = max_age
            except ValueError:
                return jsonify({
                    'status': 'error',
                    'message': 'Invalid timestamp format. Use ISO 8601 format.',
                    'code': 400
                }), 400
        
        # Use a cache key based on the request parameters
        cache_key = get_cache_key()
        
        # Try to get from cache first (only for recent data)
        if not since:
            cached_data = cache.get(cache_key)
            if cached_data:
                return jsonify({
                    'status': 'success',
                    'data': cached_data,
                    'cached': True
                })
        
        # Calculate bounding box for initial filtering (faster than calculating distance for all vehicles)
        # 1 degree of latitude ~= 111 km, 1 degree of longitude varies by latitude
        lat_radius = radius / 111.0
        lng_radius = radius / (111.0 * math.cos(math.radians(lat)))
        
        # Log query parameters for debugging
        logger.debug(f"Querying vehicles with params: lat={lat}, lng={lng}, radius={radius}, vehicle_type={vehicle_type}, since={since}")
        
        # Build base query
        query = db.session.query(
            Vehicle.id,
            Vehicle.registration,
            Vehicle.vehicle_type,
            Vehicle.current_lat,
            Vehicle.current_lng,
            Vehicle.heading,
            Vehicle.speed,
            Vehicle.updated_at
        ).filter(
            Vehicle.is_active == True,
            Vehicle.current_lat.isnot(None),
            Vehicle.current_lng.isnot(None),
            Vehicle.current_lat.between(lat - lat_radius, lat + lat_radius),
            Vehicle.current_lng.between(lng - lng_radius, lng + lng_radius)
        )
        
        logger.debug(f"Base query SQL: {str(query)}")
        
        # Log the number of active vehicles in the database (for debugging)
        try:
            total_vehicles = db.session.query(Vehicle).filter(Vehicle.is_active == True).count()
            logger.debug(f"Total active vehicles in database: {total_vehicles}")
        except Exception as e:
            logger.error(f"Error counting total vehicles: {str(e)}")
        
        # Apply filters
        if since:
            query = query.filter(Vehicle.updated_at >= since)
        
        if vehicle_type:
            query = query.filter(Vehicle.vehicle_type == vehicle_type)
        
        # Execute query
        vehicles = query.all()
        
        # Process results
        now = datetime.utcnow()
        result_vehicles = []
        
        for vehicle in vehicles:
            # Calculate distance and filter by radius
            distance = calculate_distance_km(
                lat, lng,
                vehicle.current_lat, vehicle.current_lng
            )
            
            if distance <= radius:
                result_vehicles.append({
                    'id': vehicle.id,
                    'registration': vehicle.registration,
                    'type': vehicle.vehicle_type,
                    'lat': vehicle.current_lat,
                    'lng': vehicle.current_lng,
                    'heading': vehicle.heading or 0,
                    'speed': vehicle.speed or 0,
                    'distance_km': round(distance, 2),
                    'updated_at': vehicle.updated_at.isoformat() if vehicle.updated_at else None
                })
        
        # Prepare response
        response_data = {
            'vehicles': result_vehicles,
            'timestamp': now.isoformat(),
            'count': len(result_vehicles),
            'center': {'lat': lat, 'lng': lng},
            'radius_km': radius
        }
        
        # Cache the response for 5 seconds (for identical requests)
        if not since:
            cache.set(cache_key, response_data, timeout=5)
        
        return jsonify({
            'status': 'success',
            'data': response_data
        })
        
    except ValueError as e:
        logger.warning(f"Invalid parameter: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'message': f'Invalid parameter: {str(e)}',
            'code': 400
        }), 400
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        logger.error(f'Error fetching real-time vehicles: {str(e)}\n{error_details}')
        return jsonify({
            'status': 'error',
            'message': f'Internal server error: {str(e)}',
            'code': 500,
            'details': str(e),
            'type': type(e).__name__
        }), 500


@realtime_bp.route('/stops/eta', methods=['GET'])
@limiter.limit("300 per minute")  # Increased limit for real-time data
def get_stops_with_eta():
    """
    Get nearby stops with ETA from nearest vehicles
    Query params:
    - lat: latitude (required)
    - lng: longitude (required)
    - radius: radius in km (default: 2.0)
    - stop_type: stop type filter (optional)
    """
    try:
        lat = float(request.args.get('lat', 0))
        lng = float(request.args.get('lng', 0))
        radius = float(request.args.get('radius', 2.0))
        stop_type = request.args.get('stop_type')
        
        if lat == 0 and lng == 0:
            return jsonify({'error': 'Valid coordinates are required'}), 400
        
        # Get nearby stops
        query = db.session.query(Stop).filter(Stop.is_active == True)
        
        if stop_type:
            query = query.filter(
                (Stop.stop_type == stop_type) | (Stop.stop_type == 'combined')
            )
        
        stops = query.all()
        
        nearby_stops = []
        for stop in stops:
            if stop.lat and stop.lng:
                distance = calculate_distance_km(lat, lng, stop.lat, stop.lng)
                
                if distance <= radius:
                    stop_dict = stop.to_dict()
                    stop_dict['distance_km'] = round(distance, 2)
                    
                    # Find nearest vehicle to this stop
                    nearest_vehicle = None
                    min_vehicle_distance = float('inf')
                    
                    vehicles = db.session.query(Vehicle).filter(
                        Vehicle.is_active == True,
                        Vehicle.current_lat.isnot(None),
                        Vehicle.current_lng.isnot(None)
                    ).all()
                    
                    for vehicle in vehicles:
                        vehicle_distance = calculate_distance_km(
                            stop.lat, stop.lng,
                            vehicle.current_lat, vehicle.current_lng
                        )
                        
                        # Consider vehicles within 1km of the stop
                        if vehicle_distance < 1.0 and vehicle_distance < min_vehicle_distance:
                            min_vehicle_distance = vehicle_distance
                            nearest_vehicle = vehicle
                    
                    # Calculate ETA if vehicle found
                    if nearest_vehicle:
                        eta_minutes = estimate_eta(
                            min_vehicle_distance,
                            nearest_vehicle.vehicle_type
                        )
                        stop_dict['nearest_vehicle'] = {
                            'id': nearest_vehicle.id,
                            'type': nearest_vehicle.vehicle_type,
                            'registration': nearest_vehicle.registration,
                            'distance_km': round(min_vehicle_distance, 2),
                            'eta_minutes': eta_minutes
                        }
                    else:
                        stop_dict['nearest_vehicle'] = None
                    
                    nearby_stops.append(stop_dict)
        
        # Sort by distance
        nearby_stops.sort(key=lambda x: x['distance_km'])
        
        return jsonify({
            'stops': nearby_stops,
            'count': len(nearby_stops),
            'center': {'lat': lat, 'lng': lng},
            'radius_km': radius,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except ValueError as e:
        return jsonify({'error': f'Invalid parameter: {str(e)}'}), 400
    except Exception as e:
        current_app.logger.error(f'Error fetching stops with ETA: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500
# Add this new debug endpoint after the health_check function
@realtime_bp.route('/api/v1/realtime/vehicles/debug', methods=['GET'])
def debug_vehicles():
    """Debug endpoint to check vehicle data"""
    try:
        # Get all vehicles with basic info
        vehicles = db.session.query(
            Vehicle.id,
            Vehicle.registration,
            Vehicle.vehicle_type,
            Vehicle.current_lat,
            Vehicle.current_lng,
            Vehicle.is_active,
            Vehicle.updated_at
        ).all()
        
        # Convert to list of dicts for JSON serialization
        vehicle_list = [{
            'id': str(v.id),
            'registration': v.registration,
            'type': v.vehicle_type,
            'lat': float(v.current_lat) if v.current_lat is not None else None,
            'lng': float(v.current_lng) if v.current_lng is not None else None,
            'is_active': v.is_active,
            'updated_at': v.updated_at.isoformat() if v.updated_at else None
        } for v in vehicles]
        
        return jsonify({
            'status': 'success',
            'count': len(vehicle_list),
            'vehicles': vehicle_list
        })
        
    except Exception as e:
        import traceback
        return jsonify({
            'status': 'error',
            'message': str(e),
            'traceback': traceback.format_exc()
        }), 500

