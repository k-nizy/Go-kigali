"""
Real-time vehicle tracking API routes
Uses long-polling approach for compatibility
"""

from flask import Blueprint, request, jsonify, current_app
from app.extensions import db, limiter
from models.vehicle import Vehicle
from models.stop import Stop
from datetime import datetime, timedelta
import math

realtime_bp = Blueprint('realtime', __name__)


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


@realtime_bp.route('/vehicles/realtime', methods=['GET'])
@limiter.limit("100 per minute")  # Higher limit for real-time data
def get_realtime_vehicles():
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
    try:
        lat = float(request.args.get('lat', 0))
        lng = float(request.args.get('lng', 0))
        radius = float(request.args.get('radius', 5.0))
        vehicle_type = request.args.get('type')  # optional filter
        since_str = request.args.get('since')  # ISO timestamp
        
        if lat == 0 and lng == 0:
            return jsonify({'error': 'Valid coordinates are required'}), 400
        
        # Parse since timestamp if provided
        since = None
        if since_str:
            try:
                since = datetime.fromisoformat(since_str.replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Invalid timestamp format. Use ISO 8601 format.'}), 400
        
        # Query active vehicles with coordinates
        query = db.session.query(Vehicle).filter(
            Vehicle.is_active == True,
            Vehicle.current_lat.isnot(None),
            Vehicle.current_lng.isnot(None)
        )
        
        # Filter by last_seen if since timestamp provided (for incremental updates)
        # But always include static vehicles (STATIC*) regardless of timestamp
        if since:
            # Get vehicles updated since last check OR static vehicles
            query = query.filter(
                (Vehicle.updated_at >= since) | (Vehicle.registration.like('STATIC%'))
            )
        
        if vehicle_type:
            query = query.filter(Vehicle.vehicle_type == vehicle_type)
        
        vehicles = query.all()
        
        # Log for debugging
        current_app.logger.info(f'Found {len(vehicles)} active vehicles with coordinates')
        
        nearby_vehicles = []
        vehicles_without_coords = 0
        vehicles_outside_radius = 0
        
        for vehicle in vehicles:
            if vehicle.current_lat and vehicle.current_lng:
                # Calculate distance
                distance = calculate_distance_km(
                    lat, lng,
                    vehicle.current_lat, vehicle.current_lng
                )
                
                if distance <= radius:
                    # Calculate ETA
                    eta_minutes = estimate_eta(distance, vehicle.vehicle_type)
                    
                    vehicle_dict = vehicle.to_dict()
                    vehicle_dict['distance_km'] = round(distance, 2)
                    vehicle_dict['eta_minutes'] = eta_minutes
                    vehicle_dict['bearing'] = vehicle.bearing or 0
                    vehicle_dict['speed'] = vehicle.speed or 0
                    vehicle_dict['updated_at'] = vehicle.updated_at.isoformat() if vehicle.updated_at else None
                    
                    nearby_vehicles.append(vehicle_dict)
                else:
                    vehicles_outside_radius += 1
            else:
                vehicles_without_coords += 1
        
        # Log results for debugging
        current_app.logger.info(
            f'Vehicle search results: {len(nearby_vehicles)} nearby, '
            f'{vehicles_outside_radius} outside radius, '
            f'{vehicles_without_coords} without coords'
        )
        
        # Sort by distance
        nearby_vehicles.sort(key=lambda x: x['distance_km'])
        
        return jsonify({
            'vehicles': nearby_vehicles,
            'count': len(nearby_vehicles),
            'center': {'lat': lat, 'lng': lng},
            'radius_km': radius,
            'timestamp': datetime.utcnow().isoformat(),
            'has_updates': len(nearby_vehicles) > 0,
            'debug': {
                'total_vehicles_queried': len(vehicles),
                'vehicles_without_coords': vehicles_without_coords,
                'vehicles_outside_radius': vehicles_outside_radius,
                'nearby_vehicles': len(nearby_vehicles)
            }
        })
        
    except ValueError as e:
        return jsonify({'error': f'Invalid parameter: {str(e)}'}), 400
    except Exception as e:
        current_app.logger.error(f'Error fetching real-time vehicles: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500


@realtime_bp.route('/stops/eta', methods=['GET'])
@limiter.limit("100 per minute")  # Higher limit for real-time data
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


