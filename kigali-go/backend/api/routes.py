"""
Main API routes for KigaliGo application
"""

from flask import Blueprint, request, jsonify, current_app
from app.extensions import db
from models.vehicle import Vehicle
from models.zone import Zone
from models.stop import Stop
from models.trip import Trip
from models.fare_rule import FareRule
from datetime import datetime
import requests
import os
import traceback

api_bp = Blueprint('api', __name__)

# Rate limiter will be initialized by the app factory
limiter = None

def init_limiter(app_limiter):
    """Initialize limiter from app"""
    global limiter
    limiter = app_limiter

def rate_limit_decorator(limit_str):
    """Create a rate limit decorator that works with or without limiter"""
    def decorator(func):
        if limiter:
            return limiter.limit(limit_str)(func)
        return func
    return decorator

@api_bp.route('/routes/plan', methods=['GET'])
@rate_limit_decorator("60 per minute")
def plan_route():
    """Plan a route between origin and destination"""
    try:
        origin = request.args.get('origin')
        destination = request.args.get('destination')
        
        if not origin or not destination:
            return jsonify({'error': 'Origin and destination coordinates are required'}), 400
        
        # Parse coordinates
        try:
            origin_lat, origin_lng = map(float, origin.split(','))
            dest_lat, dest_lng = map(float, destination.split(','))
        except ValueError:
            return jsonify({'error': 'Invalid coordinate format'}), 400
        
        # Get route options from Google Directions API
        route_options = get_route_options(origin_lat, origin_lng, dest_lat, dest_lng)
        
        # Calculate fare estimates for each mode
        for option in route_options:
            fare_estimate = calculate_fare_estimate(
                option['mode'],
                option['distance_km'],
                option['duration_minutes']
            )
            option['estimated_fare'] = fare_estimate
        
        return jsonify({
            'origin': {'lat': origin_lat, 'lng': origin_lng},
            'destination': {'lat': dest_lat, 'lng': dest_lng},
            'options': route_options,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/vehicles/nearby', methods=['GET'])
@rate_limit_decorator("120 per minute")
def get_nearby_vehicles():
    """Get nearby vehicles within radius"""
    try:
        lat = float(request.args.get('lat', 0))
        lng = float(request.args.get('lng', 0))
        radius = float(request.args.get('radius', 1.0))  # km
        vehicle_type = request.args.get('type')  # optional filter
        
        if lat == 0 and lng == 0:
            return jsonify({'error': 'Valid coordinates are required'}), 400
        
        # Query nearby vehicles
        vehicles = Vehicle.query.filter(Vehicle.is_active == True).all()
        
        nearby_vehicles = []
        for vehicle in vehicles:
            if vehicle.current_lat and vehicle.current_lng:
                # Calculate distance (simplified)
                distance = ((lat - vehicle.current_lat) ** 2 + (lng - vehicle.current_lng) ** 2) ** 0.5 * 111
                
                if distance <= radius:
                    if not vehicle_type or vehicle.vehicle_type == vehicle_type:
                        vehicle_dict = vehicle.to_dict()
                        vehicle_dict['distance_km'] = round(distance, 2)
                        vehicle_dict['eta_minutes'] = estimate_eta(distance, vehicle.vehicle_type)
                        nearby_vehicles.append(vehicle_dict)
        
        # Sort by distance
        nearby_vehicles.sort(key=lambda x: x['distance_km'])
        
        return jsonify({
            'vehicles': nearby_vehicles,
            'count': len(nearby_vehicles),
            'center': {'lat': lat, 'lng': lng},
            'radius_km': radius
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/zones', methods=['GET'])
def get_zones():
    """Get all zones"""
    try:
        zones = Zone.query.filter_by(is_active=True).all()
        return jsonify({
            'zones': [zone.to_dict() for zone in zones],
            'count': len(zones)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/stops', methods=['GET'])
def get_stops():
    """Get stops, optionally filtered by zone"""
    try:
        zone_id = request.args.get('zone_id')
        stop_type = request.args.get('type')
        
        query = Stop.query.filter_by(is_active=True)
        
        if zone_id:
            query = query.filter_by(zone_id=zone_id)
        
        if stop_type:
            query = query.filter(Stop.stop_type == stop_type)
        
        stops = query.all()
        
        return jsonify({
            'stops': [stop.to_dict() for stop in stops],
            'count': len(stops)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/fare/estimate', methods=['GET'])
@rate_limit_decorator("120 per minute")
def estimate_fare():
    """Estimate fare for given parameters"""
    try:
        distance_km = float(request.args.get('distance_km', 0))
        duration_minutes = float(request.args.get('duration_minutes', 0))
        mode = request.args.get('mode')
        
        if distance_km <= 0 or duration_minutes <= 0:
            return jsonify({'error': 'Distance and duration must be positive'}), 400
        
        if not mode:
            return jsonify({'error': 'Transport mode is required'}), 400
        
        fare_estimate = calculate_fare_estimate(mode, distance_km, duration_minutes)
        
        return jsonify({
            'mode': mode,
            'distance_km': distance_km,
            'duration_minutes': duration_minutes,
            'estimated_fare': fare_estimate,
            'currency': 'RWF',
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/reports', methods=['POST'])
@rate_limit_decorator("10 per minute")
def create_report():
    """Create a new report"""
    try:
        data = request.get_json() or {}
        
        # Support both 'type' and 'report_type' for compatibility
        report_type = data.get('report_type') or data.get('type', 'other')
        title = data.get('title', '')
        description = data.get('description', '')
        
        # Either title or description must be provided
        if not title and not description:
            return jsonify({'code': 400, 'message': 'Title or description is required'}), 400
        
        # Check database connection
        try:
            from sqlalchemy import text
            db.session.execute(text('SELECT 1'))
            db.session.commit()
        except Exception as db_error:
            current_app.logger.error(f'Database connection error: {db_error}')
            db.session.rollback()
            return jsonify({'code': 500, 'message': 'Database connection error. Please try again later.'}), 500
        
        # Create report
        from models.report import Report
        
        report = Report(
            user_id=data.get('user_id'),
            report_type=report_type,
            title=title or 'No title',
            description=description,
            lat=data.get('lat'),
            lng=data.get('lng'),
            address=data.get('address') or data.get('location', ''),
            vehicle_id=data.get('vehicle_id'),
            vehicle_registration=data.get('vehicle_registration', ''),
            photo_url=data.get('photo_url')
        )
        
        db.session.add(report)
        db.session.commit()
        
        return jsonify({
            'message': 'Report created successfully',
            'report': report.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Create report error: {str(e)}\n{traceback.format_exc()}')
        return jsonify({'code': 500, 'message': 'An unexpected error occurred'}), 500

@api_bp.route('/reports', methods=['GET'])
def get_reports():
    """Get reports (admin only)"""
    try:
        # In production, add authentication check
        limit = int(request.args.get('limit', 20))
        report_type = request.args.get('type')
        
        from models.report import Report
        
        reports = Report.get_recent_reports(limit=limit, report_type=report_type)
        
        return jsonify({
            'reports': [report.to_dict(include_admin_fields=True) for report in reports],
            'count': len(reports)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/statistics', methods=['GET'])
def get_statistics():
    """Get system statistics"""
    try:
        # Check database connection
        try:
            from sqlalchemy import text
            db.session.execute(text('SELECT 1'))
            db.session.commit()
        except Exception as db_error:
            current_app.logger.error(f'Database connection error: {db_error}')
            db.session.rollback()
            # Return default stats if DB is unavailable
            return jsonify({
                'statistics': {
                    'total_vehicles': 0,
                    'active_vehicles': 0,
                    'total_zones': 0,
                    'total_stops': 0,
                    'total_trips': 0,
                    'today_trips': 0
                },
                'timestamp': datetime.utcnow().isoformat()
            }), 200
        
        # Use db.session.query to ensure we're using the correct db instance
        stats = {
            'total_vehicles': db.session.query(Vehicle).filter_by(is_active=True).count(),
            'total_zones': db.session.query(Zone).filter_by(is_active=True).count(),
            'total_stops': db.session.query(Stop).filter_by(is_active=True).count(),
            'total_trips': db.session.query(Trip).count(),
            'active_vehicles': db.session.query(Vehicle).filter(
                Vehicle.is_active == True,
                Vehicle.last_seen >= datetime.utcnow().replace(hour=0, minute=0, second=0)
            ).count() if hasattr(Vehicle, 'last_seen') else db.session.query(Vehicle).filter_by(is_active=True).count(),
            'today_trips': db.session.query(Trip).filter(
                Trip.created_at >= datetime.utcnow().replace(hour=0, minute=0, second=0)
            ).count() if hasattr(Trip, 'created_at') else 0
        }
        
        return jsonify({
            'statistics': stats,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        current_app.logger.error(f'Statistics error: {str(e)}\n{traceback.format_exc()}')
        # Return default stats on error
        return jsonify({
            'statistics': {
                'total_vehicles': 0,
                'active_vehicles': 0,
                'total_zones': 0,
                'total_stops': 0,
                'total_trips': 0,
                'today_trips': 0
            },
            'timestamp': datetime.utcnow().isoformat()
        }), 200

def get_route_options(origin_lat, origin_lng, dest_lat, dest_lng):
    """Get route options using Google Directions API or fallback calculation"""
    google_api_key = os.getenv('GOOGLE_MAPS_API_KEY')
    
    if google_api_key:
        try:
            # Use Google Directions API
            url = "https://maps.googleapis.com/maps/api/directions/json"
            params = {
                'origin': f"{origin_lat},{origin_lng}",
                'destination': f"{dest_lat},{dest_lng}",
                'key': google_api_key,
                'mode': 'driving'  # Default mode
            }
            
            response = requests.get(url, params=params)
            data = response.json()
            
            if data['status'] == 'OK' and data['routes']:
                route = data['routes'][0]
                leg = route['legs'][0]
                
                distance_km = leg['distance']['value'] / 1000
                duration_minutes = leg['duration']['value'] / 60
                
                # Generate different transport options
                options = []
                
                # Bus option
                options.append({
                    'mode': 'bus',
                    'distance_km': round(distance_km, 2),
                    'duration_minutes': round(duration_minutes * 1.2, 1),  # Bus is slower
                    'route_polyline': route['overview_polyline']['points'],
                    'steps': [step['html_instructions'] for step in leg['steps']]
                })
                
                # Moto option
                options.append({
                    'mode': 'moto',
                    'distance_km': round(distance_km, 2),
                    'duration_minutes': round(duration_minutes * 0.8, 1),  # Moto is faster
                    'route_polyline': route['overview_polyline']['points'],
                    'steps': [step['html_instructions'] for step in leg['steps']]
                })
                
                # Taxi option
                options.append({
                    'mode': 'taxi',
                    'distance_km': round(distance_km, 2),
                    'duration_minutes': round(duration_minutes, 1),
                    'route_polyline': route['overview_polyline']['points'],
                    'steps': [step['html_instructions'] for step in leg['steps']]
                })
                
                return options
        except Exception as e:
            print(f"Google Directions API error: {e}")
    
    # Fallback: Simple distance calculation
    distance_km = ((dest_lat - origin_lat) ** 2 + (dest_lng - origin_lng) ** 2) ** 0.5 * 111
    
    return [
        {
            'mode': 'bus',
            'distance_km': round(distance_km, 2),
            'duration_minutes': round(distance_km * 2, 1),  # Rough estimate
            'route_polyline': None,
            'steps': ['Take bus/a>']
        },
        {
            'mode': 'moto',
            'distance_km': round(distance_km, 2),
            'duration_minutes': round(distance_km * 1.5, 1),
            'route_polyline': None,
            'steps': ['Take motorcycle taxi']
        },
        {
            'mode': 'taxi',
            'distance_km': round(distance_km, 2),
            'duration_minutes': round(distance_km * 1.8, 1),
            'route_polyline': None,
            'steps': ['Take taxi']
        }
    ]

def calculate_fare_estimate(mode, distance_km, duration_minutes):
    """Calculate fare estimate using fare rules"""
    try:
        fare_rules = FareRule.get_active_rules(mode=mode)
        
        if not fare_rules:
            # Fallback pricing
            if mode == 'bus':
                return max(500, distance_km * 200)  # 500 RWF base + 200 per km
            elif mode == 'moto':
                return max(800, distance_km * 300)  # 800 RWF base + 300 per km
            elif mode == 'taxi':
                return max(1200, distance_km * 400)  # 1200 RWF base + 400 per km
        
        # Use the most recent fare rule
        fare_rule = fare_rules[0]
        return fare_rule.calculate_fare(distance_km, duration_minutes)
        
    except Exception as e:
        print(f"Fare calculation error: {e}")
        # Return fallback pricing
        if mode == 'bus':
            return max(500, distance_km * 200)
        elif mode == 'moto':
            return max(800, distance_km * 300)
        elif mode == 'taxi':
            return max(1200, distance_km * 400)
        return 1000

def estimate_eta(distance_km, vehicle_type):
    """Estimate arrival time based on distance and vehicle type"""
    if vehicle_type == 'bus':
        return round(distance_km * 1.5, 1)  # 40 km/h average
    elif vehicle_type == 'moto':
        return round(distance_km * 1.0, 1)  # 60 km/h average
    elif vehicle_type == 'taxi':
        return round(distance_km * 1.2, 1)  # 50 km/h average
    return round(distance_km * 1.5, 1)
