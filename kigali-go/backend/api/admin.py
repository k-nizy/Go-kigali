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

@admin_bp.route('/seed', methods=['POST'])
@jwt_required()
def seed_data():
    """Seed database with sample data (development only)"""
    try:
        # In production, restrict this to admin users only
        
        # Seed vehicles
        vehicles_created = seed_vehicles()
        
        # Seed fare rules
        fare_rules_created = seed_fare_rules()
        
        return jsonify({
            'message': 'Database seeded successfully',
            'vehicles_created': vehicles_created,
            'fare_rules_created': fare_rules_created
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def seed_vehicles():
    """Seed sample vehicles"""
    vehicles_data = [
        # Buses (Tap&Go)
        {'vehicle_type': 'bus', 'registration': 'RAB001A', 'operator': 'Tap&Go', 'capacity': 50, 'route_id': 'RT001', 'route_name': 'Nyabugogo - Kacyiru'},
        {'vehicle_type': 'bus', 'registration': 'RAB002A', 'operator': 'Tap&Go', 'capacity': 50, 'route_id': 'RT002', 'route_name': 'Kimironko - Nyabugogo'},
        {'vehicle_type': 'bus', 'registration': 'RAB003A', 'operator': 'Tap&Go', 'capacity': 50, 'route_id': 'RT003', 'route_name': 'Remera - Kacyiru'},
        {'vehicle_type': 'bus', 'registration': 'RAB004A', 'operator': 'Tap&Go', 'capacity': 50, 'route_id': 'RT004', 'route_name': 'Nyamirambo - Kimironko'},
        
        # Taxis
        {'vehicle_type': 'taxi', 'registration': 'RAB005A', 'operator': 'Private', 'capacity': 4, 'fuel_type': 'petrol'},
        {'vehicle_type': 'taxi', 'registration': 'RAB006A', 'operator': 'Private', 'capacity': 4, 'fuel_type': 'petrol'},
        {'vehicle_type': 'taxi', 'registration': 'RAB007A', 'operator': 'Private', 'capacity': 4, 'fuel_type': 'hybrid'},
        
        # Motorcycles
        {'vehicle_type': 'moto', 'registration': 'RAB008A', 'operator': 'Private', 'capacity': 2, 'fuel_type': 'petrol'},
        {'vehicle_type': 'moto', 'registration': 'RAB009A', 'operator': 'Private', 'capacity': 2, 'fuel_type': 'electric'},
        {'vehicle_type': 'moto', 'registration': 'RAB010A', 'operator': 'Private', 'capacity': 2, 'fuel_type': 'petrol'},
    ]
    
    created_count = 0
    for vehicle_data in vehicles_data:
        existing = Vehicle.query.filter_by(registration=vehicle_data['registration']).first()
        if not existing:
            vehicle = Vehicle(**vehicle_data)
            
            # Set random location in Kigali
            vehicle.current_lat = -1.9441 + random.uniform(-0.05, 0.05)  # Kigali center ± 5km
            vehicle.current_lng = 30.0619 + random.uniform(-0.05, 0.05)
            vehicle.last_seen = datetime.utcnow()
            
            db.session.add(vehicle)
            created_count += 1
    
    db.session.commit()
    return created_count

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
