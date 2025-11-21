"""
Real-time vehicle tracking API routes
Uses long-polling approach for compatibility
"""

from flask import Blueprint, request, jsonify, current_app, g
from app.extensions import db, limiter, cache
from models.vehicle import Vehicle
from models.stop import Stop
from app.utils.vehicle_seed import VehicleSeeder, SeedConfig
from datetime import datetime, timedelta
from sqlalchemy import func
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
            # Ensure session is cleaned up on error
            db.session.rollback()
            db.session.remove()
            return jsonify({
                'status': 'error',
                'message': str(e) or 'Invalid request parameters',
                'code': 400
            }), 400
            
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}", exc_info=True)
            # Ensure session is cleaned up on error
            db.session.rollback()
            db.session.remove()
            return jsonify({
                'status': 'error',
                'message': 'An unexpected error occurred',
                'code': 500
            }), 500
        finally:
            # Always clean up the session after request
            # This ensures connections are returned to the pool
            try:
                db.session.close()
            except:
                pass
            
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


def _request_context(extra=None):
    ctx = {
        'path': request.path,
        'query': dict(request.args),
        'remote_ip': request.headers.get('X-Forwarded-For', request.remote_addr),
        'user_agent': request.headers.get('User-Agent'),
    }
    if extra:
        ctx.update(extra)
    return ctx


ALLOWED_VEHICLE_TYPES = {'bus', 'taxi', 'moto'}


def _validate_coordinates(lat, lng):
    if lat is None or lng is None:
        raise ValueError('Latitude and longitude are required')
    if not (-90 <= lat <= 90) or not (-180 <= lng <= 180):
        raise ValueError('Invalid coordinates provided')


def _serialize_vehicle_record(record, distance=None):
    data = {
        'id': record.id,
        'registration': record.registration,
        'type': getattr(record, 'vehicle_type', None) or getattr(record, 'type', None),
        'vehicle_type': getattr(record, 'vehicle_type', None) or getattr(record, 'type', None),
        'lat': getattr(record, 'current_lat', None) or getattr(record, 'lat', None),
        'lng': getattr(record, 'current_lng', None) or getattr(record, 'lng', None),
        'current_lat': getattr(record, 'current_lat', None) or getattr(record, 'lat', None),
        'current_lng': getattr(record, 'current_lng', None) or getattr(record, 'lng', None),
        'heading': getattr(record, 'heading', None) or getattr(record, 'bearing', None) or 0,
        'speed': getattr(record, 'speed', None) or 0,
        'bearing': getattr(record, 'bearing', None) or getattr(record, 'heading', None) or 0,
        'route_name': getattr(record, 'route_name', None),
        'operator': getattr(record, 'operator', None),
        'is_active': getattr(record, 'is_active', True),
        'updated_at': record.updated_at.isoformat() if getattr(record, 'updated_at', None) else None,
    }
    if hasattr(record, 'eta_minutes') and record.eta_minutes is not None:
        data['eta_minutes'] = record.eta_minutes
    if distance is not None:
        data['distance_km'] = round(distance, 2)
    return data


def _vehicle_counts():
    try:
        total = db.session.query(func.count(Vehicle.id)).scalar()
        active = db.session.query(func.count(Vehicle.id)).filter(Vehicle.is_active == True).scalar()
        with_location = db.session.query(func.count(Vehicle.id)).filter(
            Vehicle.is_active == True,
            Vehicle.current_lat.isnot(None),
            Vehicle.current_lng.isnot(None)
        ).scalar()
        by_type = dict(
            db.session.query(Vehicle.vehicle_type, func.count(Vehicle.id))
            .group_by(Vehicle.vehicle_type)
            .all()
        )
    except Exception as exc:
        logger.error('Failed to compute vehicle counts', extra=_request_context({'error': str(exc)}))
        return {
            'total': 0,
            'active': 0,
            'with_location': 0,
            'by_type': {},
        }

    return {
        'total': total,
        'active': active,
        'with_location': with_location,
        'by_type': by_type,
    }

@realtime_bp.route('/vehicles/realtime', methods=['GET'])
@limiter.limit("500 per minute")  # Increased limit for real-time data
@handle_errors
def get_realtime_vehicles():
    """Return all active vehicles near a coordinate with optional filters."""

    lat = request.args.get('lat', type=float)
    lng = request.args.get('lng', type=float)
    radius = min(request.args.get('radius', type=float, default=5.0) or 5.0, 20.0)
    vehicle_type = request.args.get('type')
    since_str = request.args.get('since')
    auto_seed = request.args.get('auto_seed', 'false').lower() == 'true'
    include_meta = request.args.get('include_meta', 'true').lower() != 'false'

    _validate_coordinates(lat, lng)
    if vehicle_type:
        vehicle_type = vehicle_type.lower()
        if vehicle_type not in ALLOWED_VEHICLE_TYPES:
            raise ValueError(f"Invalid vehicle type '{vehicle_type}'. Allowed: {', '.join(sorted(ALLOWED_VEHICLE_TYPES))}")

    since = None
    if since_str:
        try:
            since = datetime.fromisoformat(since_str.replace('Z', '+00:00'))
            max_age = datetime.utcnow() - timedelta(days=1)
            if since < max_age:
                since = max_age
        except ValueError:
            raise ValueError('Invalid timestamp format. Use ISO 8601 (e.g. 2024-01-01T12:00:00Z).')

    cache_key = get_cache_key()
    if not since:
        cached_payload = cache.get(cache_key)
        if cached_payload:
            cached_payload['cached'] = True
            return jsonify(cached_payload)

    lat_radius = radius / 111.0
    lng_radius = radius / (111.0 * math.cos(math.radians(lat)))

    query = db.session.query(Vehicle).filter(
        Vehicle.is_active == True,
        Vehicle.current_lat.isnot(None),
        Vehicle.current_lng.isnot(None),
        Vehicle.current_lat.between(lat - lat_radius, lat + lat_radius),
        Vehicle.current_lng.between(lng - lng_radius, lng + lng_radius)
    )

    if since:
        query = query.filter(Vehicle.updated_at >= since)
    if vehicle_type:
        query = query.filter(Vehicle.vehicle_type == vehicle_type)

    vehicles = query.all()
    seed_result = None

    if not vehicles and auto_seed:
        seed_config = SeedConfig(
            total=20,
            radius_km=max(radius, 3.0),
            center={'lat': lat, 'lng': lng},
        )
        seeder = VehicleSeeder()
        seed_result = seeder.seed(seed_config)
        vehicles = query.all()

    now = datetime.utcnow()
    result_vehicles = []
    for vehicle in vehicles:
        distance = calculate_distance_km(lat, lng, vehicle.current_lat, vehicle.current_lng)
        if distance <= radius:
            serialized = _serialize_vehicle_record(vehicle, distance)
            serialized['eta_minutes'] = estimate_eta(distance, vehicle.vehicle_type)
            result_vehicles.append(serialized)

    result_vehicles.sort(key=lambda v: v.get('distance_km', 0))

    response_payload = {
        'status': 'success',
        'vehicles': result_vehicles,
        'count': len(result_vehicles),
        'center': {'lat': lat, 'lng': lng},
        'radius_km': radius,
        'timestamp': now.isoformat(),
    }

    if include_meta:
        response_payload['meta'] = {
            'filters': {
                'type': vehicle_type,
                'since': since.isoformat() if since else None,
                'auto_seed': auto_seed,
            },
            'counts': _vehicle_counts(),
        }
        if seed_result:
            response_payload['meta']['seed'] = seed_result

    cache.set(cache_key, response_payload, timeout=5)

    logger.info(
        'Realtime vehicles response',
        extra=_request_context({
            'vehicle_count': len(result_vehicles),
            'radius_km': radius,
            'vehicle_type': vehicle_type,
        })
    )

    return jsonify(response_payload)


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
@realtime_bp.route('/vehicles/debug', methods=['GET'])
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

