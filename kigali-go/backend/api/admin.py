"""
Admin routes for KigaliGo application
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from models import db, Vehicle, Zone, Stop, FareRule, User
from models.trip import Trip
from models.report import Report
from datetime import datetime, timedelta
import random
import math

admin_bp = Blueprint('admin', __name__)

# Initialize rate limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["1000 per hour"]
)

@admin_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    """Get admin dashboard statistics"""
    try:
        # In production, check if user has admin role
        user_id = get_jwt_identity()
        
        # Get statistics
        stats = {
            'total_users': User.query.count(),
            'active_users': User.query.filter_by(is_active=True).count(),
            'total_vehicles': Vehicle.query.filter_by(is_active=True).count(),
            'active_vehicles': Vehicle.query.filter(
                Vehicle.is_active == True,
                Vehicle.last_seen >= datetime.utcnow() - timedelta(hours=1)
            ).count(),
            'total_trips': Trip.query.count(),
            'today_trips': Trip.query.filter(
                Trip.created_at >= datetime.utcnow().replace(hour=0, minute=0, second=0)
            ).count(),
            'pending_reports': Report.query.filter_by(status='pending').count(),
            'total_reports': Report.query.count()
        }
        
        # Get recent activity
        recent_trips = Trip.query.order_by(Trip.created_at.desc()).limit(5).all()
        recent_reports = Report.query.order_by(Report.created_at.desc()).limit(5).all()
        
        return jsonify({
            'statistics': stats,
            'recent_trips': [trip.to_dict() for trip in recent_trips],
            'recent_reports': [report.to_dict(include_admin_fields=True) for report in recent_reports],
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/vehicles', methods=['GET'])
@jwt_required()
def get_vehicles():
    """Get all vehicles with optional filtering"""
    try:
        vehicle_type = request.args.get('type')
        is_active = request.args.get('is_active')
        
        query = Vehicle.query
        
        if vehicle_type:
            query = query.filter_by(vehicle_type=vehicle_type)
        
        if is_active is not None:
            query = query.filter_by(is_active=is_active.lower() == 'true')
        
        vehicles = query.order_by(Vehicle.created_at.desc()).all()
        
        return jsonify({
            'vehicles': [vehicle.to_dict() for vehicle in vehicles],
            'count': len(vehicles)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/vehicles/<int:vehicle_id>', methods=['PUT'])
@jwt_required()
def update_vehicle(vehicle_id):
    """Update vehicle information"""
    try:
        vehicle = Vehicle.query.get(vehicle_id)
        if not vehicle:
            return jsonify({'error': 'Vehicle not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        if 'vehicle_type' in data:
            vehicle.vehicle_type = data['vehicle_type']
        
        if 'operator' in data:
            vehicle.operator = data['operator']
        
        if 'driver_name' in data:
            vehicle.driver_name = data['driver_name']
        
        if 'driver_phone' in data:
            vehicle.driver_phone = data['driver_phone']
        
        if 'capacity' in data:
            vehicle.capacity = data['capacity']
        
        if 'fuel_type' in data:
            vehicle.fuel_type = data['fuel_type']
        
        if 'route_id' in data:
            vehicle.route_id = data['route_id']
        
        if 'route_name' in data:
            vehicle.route_name = data['route_name']
        
        if 'is_active' in data:
            vehicle.is_active = data['is_active']
        
        if 'is_available' in data:
            vehicle.is_available = data['is_available']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Vehicle updated successfully',
            'vehicle': vehicle.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/reports/<int:report_id>', methods=['PUT'])
@jwt_required()
def update_report(report_id):
    """Update report status and admin response"""
    try:
        report = Report.query.get(report_id)
        if not report:
            return jsonify({'error': 'Report not found'}), 404
        
        data = request.get_json()
        
        # Update status
        if 'status' in data:
            report.status = data['status']
            
            if data['status'] == 'resolved':
                report.resolved_at = datetime.utcnow()
                report.resolved_by = get_jwt_identity()
        
        # Update priority
        if 'priority' in data:
            report.priority = data['priority']
        
        # Update admin response
        if 'admin_response' in data:
            report.admin_response = data['admin_response']
        
        # Update admin notes
        if 'admin_notes' in data:
            report.admin_notes = data['admin_notes']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Report updated successfully',
            'report': report.to_dict(include_admin_fields=True)
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/vehicles/status', methods=['GET'])
def get_vehicles_status():
    """Get status of all vehicles for debugging"""
    try:
        total_vehicles = Vehicle.query.count()
        active_vehicles = Vehicle.query.filter_by(is_active=True).count()
        vehicles_with_coords = Vehicle.query.filter(
            Vehicle.is_active == True,
            Vehicle.current_lat.isnot(None),
            Vehicle.current_lng.isnot(None)
        ).count()
        static_vehicles = Vehicle.query.filter(
            Vehicle.registration.like('STATIC%'),
            Vehicle.is_active == True
        ).count()
        
        # Sample vehicles
        sample_vehicles = Vehicle.query.filter_by(is_active=True).limit(5).all()
        samples = [{
            'id': v.id,
            'registration': v.registration,
            'type': v.vehicle_type,
            'has_coords': bool(v.current_lat and v.current_lng),
            'lat': v.current_lat,
            'lng': v.current_lng,
            'is_active': v.is_active
        } for v in sample_vehicles]
        
        return jsonify({
            'total_vehicles': total_vehicles,
            'active_vehicles': active_vehicles,
            'vehicles_with_coordinates': vehicles_with_coords,
            'static_vehicles': static_vehicles,
            'sample_vehicles': samples,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get vehicle status: {str(e)}'}), 500

@admin_bp.route('/seed/vehicles', methods=['POST'])
@limiter.limit("10 per hour")  # Limit to prevent abuse
def seed_vehicles_public():
    """Seed vehicles: ensures 5 static vehicles + adds 1-5 random vehicles (total 6-10)"""
    try:
        # First ensure 5 static vehicles exist
        static_created, static_updated = seed_static_vehicles()
        
        # Then add 1-5 random vehicles
        random_created = seed_random_vehicles()
        
        total_active = Vehicle.query.filter_by(is_active=True).count()
        total_with_coords = Vehicle.query.filter(
            Vehicle.is_active == True,
            Vehicle.current_lat.isnot(None),
            Vehicle.current_lng.isnot(None)
        ).count()
        
        static_count = Vehicle.query.filter(
            Vehicle.registration.like('STATIC%'),
            Vehicle.is_active == True
        ).count()
        
        # Test: Check if vehicles are visible from a test location
        import math
        def calculate_distance_km(lat1, lng1, lat2, lng2):
            """Calculate distance using Haversine formula"""
            R = 6371  # Earth's radius in kilometers
            dlat = math.radians(lat2 - lat1)
            dlng = math.radians(lng2 - lng1)
            a = (math.sin(dlat / 2) ** 2 +
                 math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
                 math.sin(dlng / 2) ** 2)
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
            return R * c
        test_lat = -1.9595
        test_lng = 30.0941
        test_radius = 5.0
        
        static_vehicles = Vehicle.query.filter(
            Vehicle.registration.like('STATIC%'),
            Vehicle.is_active == True,
            Vehicle.current_lat.isnot(None),
            Vehicle.current_lng.isnot(None)
        ).all()
        
        visible_static = []
        for v in static_vehicles:
            distance = calculate_distance_km(test_lat, test_lng, v.current_lat, v.current_lng)
            if distance <= test_radius:
                visible_static.append({
                    'registration': v.registration,
                    'distance_km': round(distance, 2),
                    'lat': v.current_lat,
                    'lng': v.current_lng
                })
        
        return jsonify({
            'message': f'Successfully seeded vehicles: {static_created} static created, {static_updated} static updated, {random_created} random vehicles added',
            'static_created': static_created,
            'static_updated': static_updated,
            'random_created': random_created,
            'total_static_vehicles': static_count,
            'total_active_vehicles': total_active,
            'vehicles_with_coordinates': total_with_coords,
            'test_visibility': {
                'test_location': {'lat': test_lat, 'lng': test_lng},
                'test_radius_km': test_radius,
                'visible_static_vehicles': len(visible_static),
                'static_vehicles_details': visible_static
            },
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        import traceback
        return jsonify({
            'error': f'Failed to seed vehicles: {str(e)}',
            'traceback': traceback.format_exc()
        }), 500

@admin_bp.route('/seed/stops', methods=['POST'])
def seed_stops():
    """Seed stops in database (public endpoint for development)"""
    try:
        from models.stop import Stop
        from models.zone import Zone
        
        # Kigali major stops with real coordinates
        KIGALI_STOPS = [
            # Nyabugogo area (main bus terminal)
            {'name': 'Nyabugogo Bus Terminal', 'code': 'NYB001', 'lat': -1.9441, 'lng': 30.0619, 'type': 'bus', 'zone': 'Nyabugogo'},
            {'name': 'Nyabugogo Taxi Park', 'code': 'NYB002', 'lat': -1.9450, 'lng': 30.0625, 'type': 'taxi', 'zone': 'Nyabugogo'},
            {'name': 'Nyabugogo Moto Park', 'code': 'NYB003', 'lat': -1.9435, 'lng': 30.0610, 'type': 'moto', 'zone': 'Nyabugogo'},
            
            # City Center
            {'name': 'City Center Bus Stop', 'code': 'CC001', 'lat': -1.9500, 'lng': 30.0580, 'type': 'bus', 'zone': 'City Center'},
            {'name': 'City Center Taxi Stand', 'code': 'CC002', 'lat': -1.9510, 'lng': 30.0590, 'type': 'taxi', 'zone': 'City Center'},
            {'name': 'City Center Combined', 'code': 'CC003', 'lat': -1.9495, 'lng': 30.0575, 'type': 'combined', 'zone': 'City Center'},
            
            # Kimironko
            {'name': 'Kimironko Bus Stop', 'code': 'KIM001', 'lat': -1.9200, 'lng': 30.0900, 'type': 'bus', 'zone': 'Kimironko'},
            {'name': 'Kimironko Taxi Stand', 'code': 'KIM002', 'lat': -1.9210, 'lng': 30.0910, 'type': 'taxi', 'zone': 'Kimironko'},
            {'name': 'Kimironko Market Stop', 'code': 'KIM003', 'lat': -1.9195, 'lng': 30.0895, 'type': 'combined', 'zone': 'Kimironko'},
            
            # Remera
            {'name': 'Remera Bus Stop', 'code': 'REM001', 'lat': -1.9300, 'lng': 30.1000, 'type': 'bus', 'zone': 'Remera'},
            {'name': 'Remera Taxi Stand', 'code': 'REM002', 'lat': -1.9310, 'lng': 30.1010, 'type': 'taxi', 'zone': 'Remera'},
            
            # Kacyiru
            {'name': 'Kacyiru Bus Stop', 'code': 'KAC001', 'lat': -1.9400, 'lng': 30.0800, 'type': 'bus', 'zone': 'Kacyiru'},
            {'name': 'Kacyiru Combined Stop', 'code': 'KAC002', 'lat': -1.9410, 'lng': 30.0810, 'type': 'combined', 'zone': 'Kacyiru'},
            
            # Gikondo
            {'name': 'Gikondo Bus Stop', 'code': 'GIK001', 'lat': -1.9600, 'lng': 30.0700, 'type': 'bus', 'zone': 'Gikondo'},
            {'name': 'Gikondo Taxi Stand', 'code': 'GIK002', 'lat': -1.9610, 'lng': 30.0710, 'type': 'taxi', 'zone': 'Gikondo'},
            
            # Kabeza
            {'name': 'Kabeza Bus Stop', 'code': 'KAB001', 'lat': -1.9700, 'lng': 30.0500, 'type': 'bus', 'zone': 'Kabeza'},
            {'name': 'Kabeza Combined Stop', 'code': 'KAB002', 'lat': -1.9710, 'lng': 30.0510, 'type': 'combined', 'zone': 'Kabeza'},
            
            # Kanombe (Airport area)
            {'name': 'Kanombe Bus Stop', 'code': 'KAN001', 'lat': -1.9800, 'lng': 30.1400, 'type': 'bus', 'zone': 'Kanombe'},
            {'name': 'Kigali Airport Stop', 'code': 'KAN002', 'lat': -1.9682, 'lng': 30.1394, 'type': 'combined', 'zone': 'Kanombe'},
            
            # Kicukiro
            {'name': 'Kicukiro Bus Stop', 'code': 'KIC001', 'lat': -1.9500, 'lng': 30.1100, 'type': 'bus', 'zone': 'Kicukiro'},
            {'name': 'Kicukiro Taxi Stand', 'code': 'KIC002', 'lat': -1.9510, 'lng': 30.1110, 'type': 'taxi', 'zone': 'Kicukiro'},
            
            # Nyamirambo
            {'name': 'Nyamirambo Bus Stop', 'code': 'NYA001', 'lat': -1.9400, 'lng': 30.0400, 'type': 'bus', 'zone': 'Nyamirambo'},
            {'name': 'Nyamirambo Combined Stop', 'code': 'NYA002', 'lat': -1.9410, 'lng': 30.0410, 'type': 'combined', 'zone': 'Nyamirambo'},
            
            # Additional stops for better coverage
            {'name': 'University of Rwanda Stop', 'code': 'UR001', 'lat': -1.9300, 'lng': 30.0700, 'type': 'bus', 'zone': 'Remera'},
            {'name': 'Kigali Convention Centre Stop', 'code': 'KCC001', 'lat': -1.9500, 'lng': 30.0900, 'type': 'combined', 'zone': 'Kacyiru'},
            {'name': 'Amahoro Stadium Stop', 'code': 'AMS001', 'lat': -1.9350, 'lng': 30.0950, 'type': 'bus', 'zone': 'Remera'},
        ]
        
        # Get or create zones
        zones_dict = {}
        for stop_data in KIGALI_STOPS:
            zone_name = stop_data['zone']
            if zone_name not in zones_dict:
                zone = Zone.query.filter_by(name=zone_name).first()
                if not zone:
                    # Create zone if doesn't exist
                    zone = Zone(
                        name=zone_name,
                        code=zone_name[:3].upper(),
                        district='Kigali',
                        center_lat=stop_data['lat'],
                        center_lng=stop_data['lng'],
                        is_active=True
                    )
                    db.session.add(zone)
                    db.session.flush()  # Get zone ID
                zones_dict[zone_name] = zone
        
        db.session.commit()  # Commit zones first
        
        # Create stops
        created_count = 0
        for stop_data in KIGALI_STOPS:
            existing = Stop.query.filter_by(code=stop_data['code']).first()
            if not existing:
                zone = zones_dict[stop_data['zone']]
                stop = Stop(
                    name=stop_data['name'],
                    code=stop_data['code'],
                    lat=stop_data['lat'],
                    lng=stop_data['lng'],
                    zone_id=zone.id,
                    stop_type=stop_data['type'],
                    is_active=True,
                    is_shelter=True,
                    operating_hours='06:00-22:00'
                )
                db.session.add(stop)
                created_count += 1
        
        db.session.commit()
        
        total_stops = Stop.query.count()
        
        return jsonify({
            'message': f'Successfully seeded {created_count} stops',
            'created': created_count,
            'total_stops': total_stops,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to seed stops: {str(e)}'}), 500

@admin_bp.route('/seed', methods=['POST'])
@jwt_required()
def seed_data():
    """Seed database with sample data (development only)"""
    try:
        # In production, restrict this to admin users only
        
        # Seed vehicles
        vehicles_result = seed_vehicles()
        if isinstance(vehicles_result, tuple):
            vehicles_created, vehicles_updated = vehicles_result
        else:
            vehicles_created = vehicles_result
            vehicles_updated = 0
        
        # Seed fare rules
        fare_rules_created = seed_fare_rules()
        
        return jsonify({
            'message': 'Database seeded successfully',
            'vehicles_created': vehicles_created,
            'vehicles_updated': vehicles_updated,
            'fare_rules_created': fare_rules_created
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def seed_static_vehicles():
    """Seed 5 static vehicles with fixed coordinates that always exist"""
    # Use a location that's more likely to be near users
    # Based on logs, users are around -1.9595, 30.0941
    # Place vehicles in a cluster around this area, all within 3km of each other
    base_lat = -1.9595
    base_lng = 30.0941
    
    # 5 static vehicles with fixed coordinates (always the same)
    # All within 2-3km of base location to ensure visibility
    static_vehicles = [
        {
            'vehicle_type': 'bus',
            'registration': 'STATIC001',
            'operator': 'Tap&Go',
            'capacity': 50,
            'route_id': 'RT001',
            'route_name': 'Nyabugogo - Kacyiru',
            'current_lat': base_lat + 0.01,  # ~1.1km north
            'current_lng': base_lng + 0.01,  # ~1.1km east
        },
        {
            'vehicle_type': 'bus',
            'registration': 'STATIC002',
            'operator': 'Tap&Go',
            'capacity': 50,
            'route_id': 'RT002',
            'route_name': 'Kimironko - Nyabugogo',
            'current_lat': base_lat - 0.01,  # ~1.1km south
            'current_lng': base_lng + 0.015,  # ~1.7km east
        },
        {
            'vehicle_type': 'taxi',
            'registration': 'STATIC003',
            'operator': 'Private',
            'capacity': 4,
            'fuel_type': 'petrol',
            'current_lat': base_lat + 0.015,  # ~1.7km north
            'current_lng': base_lng - 0.01,  # ~1.1km west
        },
        {
            'vehicle_type': 'taxi',
            'registration': 'STATIC004',
            'operator': 'Private',
            'capacity': 4,
            'fuel_type': 'hybrid',
            'current_lat': base_lat - 0.005,  # ~0.6km south
            'current_lng': base_lng - 0.015,  # ~1.7km west
        },
        {
            'vehicle_type': 'moto',
            'registration': 'STATIC005',
            'operator': 'Private',
            'capacity': 2,
            'fuel_type': 'petrol',
            'current_lat': base_lat + 0.02,  # ~2.2km north
            'current_lng': base_lng + 0.005,  # ~0.6km east
        },
    ]
    
    created_count = 0
    updated_count = 0
    
    for vehicle_data in static_vehicles:
        # Extract coordinates before creating vehicle
        current_lat = vehicle_data.pop('current_lat')
        current_lng = vehicle_data.pop('current_lng')
        
        existing = Vehicle.query.filter_by(registration=vehicle_data['registration']).first()
        
        if not existing:
            # Create new static vehicle
            vehicle = Vehicle(**vehicle_data)
            vehicle.current_lat = current_lat
            vehicle.current_lng = current_lng
            vehicle.bearing = random.uniform(0, 360)
            vehicle.speed = random.uniform(20, 60)
            vehicle.is_active = True
            vehicle.is_available = True
            vehicle.last_seen = datetime.utcnow()
            vehicle.updated_at = datetime.utcnow()
            
            db.session.add(vehicle)
            created_count += 1
        else:
            # Always update static vehicles to ensure they're active and in correct location
            existing.current_lat = current_lat
            existing.current_lng = current_lng
            if not existing.bearing:
                existing.bearing = random.uniform(0, 360)
            if not existing.speed:
                existing.speed = random.uniform(20, 60)
            existing.is_active = True
            existing.is_available = True
            existing.last_seen = datetime.utcnow()
            existing.updated_at = datetime.utcnow()
            updated_count += 1
    
    db.session.commit()
    return created_count, updated_count


def seed_random_vehicles(count=None):
    """Seed random vehicles (1-5 additional vehicles)"""
    # Use same base location as static vehicles for consistency
    base_lat = -1.9595
    base_lng = 30.0941
    
    # Determine how many random vehicles to create (1-5)
    if count is None:
        count = random.randint(1, 5)
    
    vehicle_types = ['bus', 'taxi', 'moto']
    operators = ['Tap&Go', 'Private', 'City Transport']
    fuel_types = ['petrol', 'diesel', 'electric', 'hybrid']
    
    created_count = 0
    
    for i in range(count):
        vehicle_type = random.choice(vehicle_types)
        
        # Generate unique registration
        registration = f'RAND{random.randint(1000, 9999)}{chr(random.randint(65, 90))}'
        
        # Check if registration already exists
        while Vehicle.query.filter_by(registration=registration).first():
            registration = f'RAND{random.randint(1000, 9999)}{chr(random.randint(65, 90))}'
        
        vehicle_data = {
            'vehicle_type': vehicle_type,
            'registration': registration,
            'operator': random.choice(operators),
            'capacity': 50 if vehicle_type == 'bus' else (4 if vehicle_type == 'taxi' else 2),
            'fuel_type': random.choice(fuel_types) if vehicle_type != 'bus' else random.choice(['diesel', 'electric']),
        }
        
        # Add route info for buses
        if vehicle_type == 'bus':
            routes = [
                {'route_id': 'RT001', 'route_name': 'Nyabugogo - Kacyiru'},
                {'route_id': 'RT002', 'route_name': 'Kimironko - Nyabugogo'},
                {'route_id': 'RT003', 'route_name': 'Remera - Kacyiru'},
                {'route_id': 'RT004', 'route_name': 'Nyamirambo - Kimironko'},
            ]
            vehicle_data.update(random.choice(routes))
        
        vehicle = Vehicle(**vehicle_data)
        
        # Random location within 3km of base location (well within 5km search radius)
        vehicle.current_lat = base_lat + random.uniform(-0.03, 0.03)
        vehicle.current_lng = base_lng + random.uniform(-0.03, 0.03)
        vehicle.bearing = random.uniform(0, 360)
        vehicle.speed = random.uniform(20, 60)
        vehicle.is_active = True
        vehicle.is_available = True
        vehicle.last_seen = datetime.utcnow()
        vehicle.updated_at = datetime.utcnow()
        
        db.session.add(vehicle)
        created_count += 1
    
    db.session.commit()
    return created_count


def seed_vehicles():
    """Seed vehicles: ensures 5 static vehicles exist, then adds 1-5 random vehicles"""
    # First, ensure 5 static vehicles exist
    static_created, static_updated = seed_static_vehicles()
    
    # Then add 1-5 random vehicles
    random_created = seed_random_vehicles()
    
    return static_created + random_created, static_updated

def seed_fare_rules():
    """Seed fare rules"""
    fare_rules_data = [
        # Bus fare rules
        {'mode': 'bus', 'base_fare': 500, 'per_km_rate': 150, 'per_minute_rate': 10, 'minimum_fare': 500, 'currency': 'RWF'},
        
        # Moto fare rules
        {'mode': 'moto', 'base_fare': 800, 'per_km_rate': 300, 'per_minute_rate': 20, 'minimum_fare': 800, 'currency': 'RWF'},
        
        # Taxi fare rules
        {'mode': 'taxi', 'base_fare': 1200, 'per_km_rate': 400, 'per_minute_rate': 30, 'minimum_fare': 1200, 'currency': 'RWF'},
    ]
    
    created_count = 0
    for rule_data in fare_rules_data:
        existing = FareRule.query.filter_by(mode=rule_data['mode']).first()
        if not existing:
            fare_rule = FareRule(**rule_data)
            db.session.add(fare_rule)
            created_count += 1
    
    db.session.commit()
    return created_count

@admin_bp.route('/vehicles/simulate', methods=['POST'])
@jwt_required()
def simulate_vehicle_movement():
    """Simulate vehicle movement for development"""
    try:
        vehicles = Vehicle.query.filter_by(is_active=True).all()
        moved_count = 0
        
        for vehicle in vehicles:
            if vehicle.current_lat and vehicle.current_lng:
                # Move vehicle slightly
                lat_change = random.uniform(-0.001, 0.001)  # ~100m
                lng_change = random.uniform(-0.001, 0.001)
                
                new_lat = vehicle.current_lat + lat_change
                new_lng = vehicle.current_lng + lng_change
                
                # Keep within Kigali bounds
                new_lat = max(-2.0, min(-1.8, new_lat))
                new_lng = max(29.9, min(30.3, new_lng))
                
                vehicle.update_location(new_lat, new_lng)
                moved_count += 1
        
        db.session.commit()
        
        return jsonify({
            'message': f'Simulated movement for {moved_count} vehicles',
            'moved_count': moved_count
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
