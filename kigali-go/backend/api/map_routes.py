"""
Enhanced map-related API routes for Google Maps integration
"""

from flask import Blueprint, request, jsonify, current_app
from app.extensions import db
from models.vehicle import Vehicle
from models.stop import Stop
from models.zone import Zone
from datetime import datetime
import math
import os

map_bp = Blueprint('map', __name__)


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
    # Average speeds in km/h (adjusted for Kigali traffic)
    speeds = {
        'bus': 30,      # 30 km/h average
        'taxi': 40,     # 40 km/h average
        'moto': 50      # 50 km/h average
    }
    
    base_speed = speeds.get(vehicle_type, 35)
    adjusted_speed = base_speed * traffic_factor
    
    # Time = Distance / Speed (convert to minutes)
    eta_minutes = (distance_km / adjusted_speed) * 60
    
    return round(eta_minutes, 1)


@map_bp.route('/vehicles/nearby', methods=['GET'])
def get_nearby_vehicles():
    """
    Get nearby vehicles with enhanced information including ETA
    Query params:
    - lat: latitude (required)
    - lng: longitude (required)
    - radius: radius in km (default: 5.0)
    - type: vehicle type filter (bus, taxi, moto) (optional)
    """
    try:
        lat = float(request.args.get('lat', 0))
        lng = float(request.args.get('lng', 0))
        radius = float(request.args.get('radius', 5.0))  # Default 5km
        vehicle_type = request.args.get('type')  # optional filter
        
        if lat == 0 and lng == 0:
            return jsonify({'error': 'Valid coordinates are required'}), 400
        
        # Query active vehicles
        query = db.session.query(Vehicle).filter(Vehicle.is_active == True)
        
        if vehicle_type:
            query = query.filter(Vehicle.vehicle_type == vehicle_type)
        
        vehicles = query.all()
        
        nearby_vehicles = []
        for vehicle in vehicles:
            if vehicle.current_lat and vehicle.current_lng:
                # Calculate distance using Haversine formula
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
                    
                    nearby_vehicles.append(vehicle_dict)
        
        # Sort by distance
        nearby_vehicles.sort(key=lambda x: x['distance_km'])
        
        return jsonify({
            'vehicles': nearby_vehicles,
            'count': len(nearby_vehicles),
            'center': {'lat': lat, 'lng': lng},
            'radius_km': radius,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except ValueError as e:
        return jsonify({'error': f'Invalid parameter: {str(e)}'}), 400
    except Exception as e:
        current_app.logger.error(f'Error fetching nearby vehicles: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500


@map_bp.route('/vehicles/<int:vehicle_id>', methods=['GET'])
def get_vehicle_details(vehicle_id):
    """
    Get detailed information about a specific vehicle
    """
    try:
        vehicle = db.session.query(Vehicle).filter_by(id=vehicle_id, is_active=True).first()
        
        if not vehicle:
            return jsonify({'error': 'Vehicle not found'}), 404
        
        # If user location provided, calculate distance and ETA
        user_lat = request.args.get('lat', type=float)
        user_lng = request.args.get('lng', type=float)
        
        vehicle_dict = vehicle.to_dict()
        
        if user_lat and user_lng and vehicle.current_lat and vehicle.current_lng:
            distance = calculate_distance_km(
                user_lat, user_lng,
                vehicle.current_lat, vehicle.current_lng
            )
            eta_minutes = estimate_eta(distance, vehicle.vehicle_type)
            
            vehicle_dict['distance_km'] = round(distance, 2)
            vehicle_dict['eta_minutes'] = eta_minutes
        
        return jsonify({
            'vehicle': vehicle_dict
        })
        
    except Exception as e:
        current_app.logger.error(f'Error fetching vehicle details: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500


@map_bp.route('/stops/nearby', methods=['GET'])
def get_nearby_stops():
    """
    Get nearby stops within radius
    Query params:
    - lat: latitude (required)
    - lng: longitude (required)
    - radius: radius in km (default: 2.0)
    - type: stop type filter (bus, taxi, moto, combined) (optional)
    """
    try:
        lat = float(request.args.get('lat', 0))
        lng = float(request.args.get('lng', 0))
        radius = float(request.args.get('radius', 2.0))  # Default 2km
        stop_type = request.args.get('type')  # optional filter
        
        if lat == 0 and lng == 0:
            return jsonify({'error': 'Valid coordinates are required'}), 400
        
        # Query active stops
        query = db.session.query(Stop).filter(Stop.is_active == True)
        
        if stop_type:
            query = query.filter(
                (Stop.stop_type == stop_type) | (Stop.stop_type == 'combined')
            )
        
        stops = query.all()
        
        nearby_stops = []
        for stop in stops:
            if stop.lat and stop.lng:
                # Calculate distance
                distance = calculate_distance_km(lat, lng, stop.lat, stop.lng)
                
                if distance <= radius:
                    stop_dict = stop.to_dict()
                    stop_dict['distance_km'] = round(distance, 2)
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
        current_app.logger.error(f'Error fetching nearby stops: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500


@map_bp.route('/geocode', methods=['POST'])
def geocode_address():
    """
    Geocode an address to coordinates (optional - can use frontend Places API)
    This is a fallback if frontend geocoding fails
    """
    try:
        data = request.get_json() or {}
        address = data.get('address')
        
        if not address:
            return jsonify({'error': 'Address is required'}), 400
        
        # In production, you could use Google Geocoding API here
        # For now, return error suggesting frontend use Places API
        return jsonify({
            'error': 'Use frontend Places API for geocoding',
            'message': 'This endpoint is reserved for future backend geocoding'
        }), 501
        
    except Exception as e:
        current_app.logger.error(f'Geocoding error: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500


