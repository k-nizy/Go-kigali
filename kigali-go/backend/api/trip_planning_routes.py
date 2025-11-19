"""
Advanced Trip Planning API routes with Google Directions API integration
"""

from flask import Blueprint, request, jsonify, current_app
from app.extensions import db
from models.vehicle import Vehicle
from models.stop import Stop
from models.zone import Zone
from datetime import datetime
import requests
import os
import math
import random

trip_planning_bp = Blueprint('trip_planning', __name__)


def calculate_distance_km(lat1, lng1, lat2, lng2):
    """Calculate distance between two points using Haversine formula"""
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
    """Estimate arrival time based on distance and vehicle type"""
    speeds = {
        'bus': 30,
        'taxi': 40,
        'moto': 50
    }
    
    base_speed = speeds.get(vehicle_type, 35)
    adjusted_speed = base_speed * traffic_factor
    eta_minutes = (distance_km / adjusted_speed) * 60
    return round(eta_minutes, 1)


def calculate_fare_estimate(mode, distance_km, duration_minutes):
    """
    Calculate fare estimate with randomized fares for taxis and motos.
    
    Fare ranges:
    - Taxis: 7,000 - 9,000 RWF (randomly selected)
    - Moto: 1,000 - 2,000 RWF (randomly selected)
    - Bus: Uses existing fare rules or fallback pricing
    
    Args:
        mode: 'bus', 'taxi', or 'moto'
        distance_km: Distance in kilometers
        duration_minutes: Duration in minutes
    
    Returns:
        int: Estimated fare in RWF
    """
    try:
        # Randomized fare calculation for taxis and motos
        if mode == 'taxi':
            # Taxis: random fare between 7,000 and 9,000 RWF
            fare_options = [7000, 8000, 9000]
            return random.choice(fare_options)
        
        elif mode == 'moto':
            # Moto: random fare between 1,000 and 2,000 RWF
            # Generate random integer between 1000 and 2000 (inclusive)
            return random.randint(1000, 2000)
        
        elif mode == 'bus':
            # Bus: Use existing fare rules or fallback pricing
            try:
                from models.fare_rule import FareRule
                fare_rules = FareRule.get_active_rules(mode=mode)
                
                if fare_rules:
                    fare_rule = fare_rules[0]
                    return fare_rule.calculate_fare(distance_km, duration_minutes)
            except Exception:
                pass
            
            # Fallback pricing for bus
            return max(500, round(distance_km * 200))
        
        else:
            # Unknown mode, return default
            current_app.logger.warning(f'Unknown mode for fare calculation: {mode}')
            return 1000
        
    except Exception as e:
        current_app.logger.error(f'Fare calculation error: {e}')
        # Fallback pricing on error
        if mode == 'taxi':
            return 8000  # Default to middle of range
        elif mode == 'moto':
            return 1500  # Default to middle of range
        elif mode == 'bus':
            return max(500, round(distance_km * 200))
        return 1000


def get_google_directions(origin_lat, origin_lng, dest_lat, dest_lng, mode='driving'):
    """
    Get directions from Google Directions API
    Returns route data including polyline, steps, distance, duration
    """
    google_api_key = os.getenv('GOOGLE_MAPS_API_KEY')
    
    if not google_api_key:
        current_app.logger.warning('Google Maps API key not configured')
        return None
    
    try:
        url = "https://maps.googleapis.com/maps/api/directions/json"
        params = {
            'origin': f"{origin_lat},{origin_lng}",
            'destination': f"{dest_lat},{dest_lng}",
            'key': google_api_key,
            'mode': mode,
            'alternatives': 'true',  # Get alternative routes
        }
        
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
        
        if data['status'] == 'OK' and data['routes']:
            return data['routes']
        else:
            current_app.logger.warning(f'Google Directions API error: {data.get("status")}')
            return None
            
    except Exception as e:
        current_app.logger.error(f'Google Directions API error: {e}')
        return None


def parse_google_route(route, vehicle_mode):
    """
    Parse Google Directions route into our format
    """
    if not route or not route.get('legs'):
        return None
    
    leg = route['legs'][0]
    
    # Extract route data
    distance_km = leg['distance']['value'] / 1000  # Convert meters to km
    duration_minutes = leg['duration']['value'] / 60  # Convert seconds to minutes
    
    # Adjust duration based on vehicle type
    speed_multipliers = {
        'bus': 1.2,    # Bus is slower
        'taxi': 1.0,   # Taxi is normal
        'moto': 0.8,   # Moto is faster
    }
    adjusted_duration = duration_minutes * speed_multipliers.get(vehicle_mode, 1.0)
    
    # Extract steps
    steps = []
    for step in leg['steps']:
        # Remove HTML tags from instructions
        instruction = step['html_instructions']
        import re
        instruction = re.sub('<[^<]+?>', '', instruction)
        steps.append({
            'instruction': instruction,
            'distance': step['distance']['text'],
            'duration': step['duration']['text'],
            'start_location': {
                'lat': step['start_location']['lat'],
                'lng': step['start_location']['lng']
            },
            'end_location': {
                'lat': step['end_location']['lat'],
                'lng': step['end_location']['lng']
            }
        })
    
    # Get polyline
    polyline = route.get('overview_polyline', {}).get('points', '')
    
    return {
        'distance_km': round(distance_km, 2),
        'duration_minutes': round(adjusted_duration, 1),
        'polyline': polyline,
        'steps': steps,
        'bounds': route.get('bounds', {}),
        'summary': route.get('summary', '')
    }


@trip_planning_bp.route('/plan', methods=['POST'])
def plan_trip():
    """
    Plan multi-modal trip with Google Directions API
    Request body:
    {
        "origin": {"lat": -1.9441, "lng": 30.0619} or "address string",
        "destination": {"lat": -1.9307, "lng": 30.1182} or "address string",
        "modes": ["bus", "taxi", "moto"] (optional, defaults to all)
    }
    """
    try:
        data = request.get_json() or {}
        
        origin = data.get('origin')
        destination = data.get('destination')
        modes = data.get('modes', ['bus', 'taxi', 'moto'])
        
        if not origin or not destination:
            return jsonify({'error': 'Origin and destination are required'}), 400
        
        # Parse origin coordinates
        if isinstance(origin, dict):
            origin_lat = float(origin.get('lat', 0))
            origin_lng = float(origin.get('lng', 0))
        elif isinstance(origin, str):
            # Try to parse as coordinates
            try:
                origin_lat, origin_lng = map(float, origin.split(','))
            except:
                return jsonify({'error': 'Origin must be coordinates (lat,lng) or {lat, lng} object'}), 400
        else:
            return jsonify({'error': 'Invalid origin format'}), 400
        
        # Parse destination coordinates
        if isinstance(destination, dict):
            dest_lat = float(destination.get('lat', 0))
            dest_lng = float(destination.get('lng', 0))
        elif isinstance(destination, str):
            try:
                dest_lat, dest_lng = map(float, destination.split(','))
            except:
                return jsonify({'error': 'Destination must be coordinates (lat,lng) or {lat, lng} object'}), 400
        else:
            return jsonify({'error': 'Invalid destination format'}), 400
        
        if origin_lat == 0 and origin_lng == 0:
            return jsonify({'error': 'Valid origin coordinates are required'}), 400
        if dest_lat == 0 and dest_lng == 0:
            return jsonify({'error': 'Valid destination coordinates are required'}), 400
        
        # Get Google Directions for each mode
        route_options = []
        
        for mode in modes:
            if mode not in ['bus', 'taxi', 'moto']:
                continue
            
            # Get Google Directions (using driving mode for all, we adjust times)
            google_routes = get_google_directions(
                origin_lat, origin_lng,
                dest_lat, dest_lng,
                mode='driving'
            )
            
            if google_routes:
                # Use the first (best) route
                route_data = parse_google_route(google_routes[0], mode)
                
                if route_data:
                    # Calculate fare
                    fare = calculate_fare_estimate(
                        mode,
                        route_data['distance_km'],
                        route_data['duration_minutes']
                    )
                    
                    route_option = {
                        'mode': mode,
                        'distance_km': route_data['distance_km'],
                        'duration_minutes': route_data['duration_minutes'],
                        'estimated_fare': fare,
                        'polyline': route_data['polyline'],
                        'steps': route_data['steps'],
                        'summary': route_data.get('summary', ''),
                        'bounds': route_data.get('bounds', {})
                    }
                    route_options.append(route_option)
            else:
                # Fallback: Calculate without Google Directions
                distance_km = calculate_distance_km(origin_lat, origin_lng, dest_lat, dest_lng)
                duration_minutes = estimate_eta(distance_km, mode)
                fare = calculate_fare_estimate(mode, distance_km, duration_minutes)
                
                route_option = {
                    'mode': mode,
                    'distance_km': round(distance_km, 2),
                    'duration_minutes': round(duration_minutes, 1),
                    'estimated_fare': fare,
                    'polyline': None,
                    'steps': [{'instruction': f'Take {mode} from origin to destination'}],
                    'summary': 'Direct route',
                    'bounds': {}
                }
                route_options.append(route_option)
        
        # Sort by duration (fastest first)
        route_options.sort(key=lambda x: x['duration_minutes'])
        
        return jsonify({
            'origin': {'lat': origin_lat, 'lng': origin_lng},
            'destination': {'lat': dest_lat, 'lng': dest_lng},
            'routes': route_options,
            'count': len(route_options),
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except ValueError as e:
        return jsonify({'error': f'Invalid parameter: {str(e)}'}), 400
    except Exception as e:
        current_app.logger.error(f'Error planning trip: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500


@trip_planning_bp.route('/compare', methods=['POST'])
def compare_routes():
    """
    Compare multiple routes side-by-side
    Request body same as /plan
    Returns routes sorted by different criteria (duration, fare, distance)
    """
    try:
        data = request.get_json() or {}
        
        # Use the same planning logic
        origin = data.get('origin')
        destination = data.get('destination')
        modes = data.get('modes', ['bus', 'taxi', 'moto'])
        sort_by = data.get('sort_by', 'duration')  # duration, fare, distance
        
        if not origin or not destination:
            return jsonify({'error': 'Origin and destination are required'}), 400
        
        # Parse coordinates (same as plan_trip)
        if isinstance(origin, dict):
            origin_lat = float(origin.get('lat', 0))
            origin_lng = float(origin.get('lng', 0))
        elif isinstance(origin, str):
            try:
                origin_lat, origin_lng = map(float, origin.split(','))
            except:
                return jsonify({'error': 'Invalid origin format'}), 400
        else:
            return jsonify({'error': 'Invalid origin format'}), 400
        
        if isinstance(destination, dict):
            dest_lat = float(destination.get('lat', 0))
            dest_lng = float(destination.get('lng', 0))
        elif isinstance(destination, str):
            try:
                dest_lat, dest_lng = map(float, destination.split(','))
            except:
                return jsonify({'error': 'Invalid destination format'}), 400
        else:
            return jsonify({'error': 'Invalid destination format'}), 400
        
        # Get routes (reuse plan_trip logic)
        # For now, call the same logic
        # In production, you'd refactor to share the logic
        
        # Get Google Directions
        route_options = []
        for mode in modes:
            if mode not in ['bus', 'taxi', 'moto']:
                continue
            
            google_routes = get_google_directions(
                origin_lat, origin_lng,
                dest_lat, dest_lng,
                mode='driving'
            )
            
            if google_routes:
                route_data = parse_google_route(google_routes[0], mode)
                if route_data:
                    fare = calculate_fare_estimate(
                        mode,
                        route_data['distance_km'],
                        route_data['duration_minutes']
                    )
                    route_option = {
                        'mode': mode,
                        'distance_km': route_data['distance_km'],
                        'duration_minutes': route_data['duration_minutes'],
                        'estimated_fare': fare,
                        'polyline': route_data['polyline'],
                        'steps': route_data['steps'],
                    }
                    route_options.append(route_option)
            else:
                # Fallback
                distance_km = calculate_distance_km(origin_lat, origin_lng, dest_lat, dest_lng)
                duration_minutes = estimate_eta(distance_km, mode)
                fare = calculate_fare_estimate(mode, distance_km, duration_minutes)
                route_options.append({
                    'mode': mode,
                    'distance_km': round(distance_km, 2),
                    'duration_minutes': round(duration_minutes, 1),
                    'estimated_fare': fare,
                    'polyline': None,
                    'steps': [],
                })
        
        # Sort by requested criteria
        if sort_by == 'duration':
            route_options.sort(key=lambda x: x['duration_minutes'])
        elif sort_by == 'fare':
            route_options.sort(key=lambda x: x['estimated_fare'])
        elif sort_by == 'distance':
            route_options.sort(key=lambda x: x['distance_km'])
        
        return jsonify({
            'origin': {'lat': origin_lat, 'lng': origin_lng},
            'destination': {'lat': dest_lat, 'lng': dest_lng},
            'routes': route_options,
            'sort_by': sort_by,
            'count': len(route_options),
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        current_app.logger.error(f'Error comparing routes: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500

