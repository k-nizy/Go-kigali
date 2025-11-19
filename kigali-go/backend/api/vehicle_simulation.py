"""
Vehicle movement simulation for testing real-time features
Simulates vehicles moving around Kigali
"""

from flask import Blueprint, jsonify, current_app
from app.extensions import db
from models.vehicle import Vehicle
from datetime import datetime
import random
import math

simulation_bp = Blueprint('simulation', __name__)

# Kigali bounds for realistic movement
KIGALI_CENTER = {'lat': -1.9441, 'lng': 30.0619}
KIGALI_BOUNDS = {
    'min_lat': -1.98,
    'max_lat': -1.90,
    'min_lng': 30.03,
    'max_lng': 30.14
}


def simulate_vehicle_movement():
    """
    Simulate realistic vehicle movement within Kigali
    Moves vehicles in random directions with realistic speeds
    """
    try:
        vehicles = db.session.query(Vehicle).filter(Vehicle.is_active == True).all()
        
        if not vehicles:
            return {
                'message': 'No active vehicles to simulate',
                'moved_count': 0
            }
        
        moved_count = 0
        
        for vehicle in vehicles:
            if not vehicle.current_lat or not vehicle.current_lng:
                # Set initial random location if vehicle has no location
                vehicle.current_lat = KIGALI_CENTER['lat'] + random.uniform(-0.05, 0.05)
                vehicle.current_lng = KIGALI_CENTER['lng'] + random.uniform(-0.05, 0.05)
                vehicle.bearing = random.uniform(0, 360)
                vehicle.speed = random.uniform(20, 50)  # km/h
            else:
                # Move vehicle based on current bearing and speed
                # Convert speed from km/h to degrees per update (assuming 30s updates)
                # 1 degree latitude ≈ 111 km
                # 1 degree longitude ≈ 111 km * cos(latitude)
                
                speed_km_per_sec = vehicle.speed / 3600  # km per second
                time_interval = 30  # seconds between updates
                distance_km = speed_km_per_sec * time_interval
                
                # Convert to degrees
                lat_change = (distance_km / 111) * math.cos(math.radians(vehicle.bearing or 0))
                lng_change = (distance_km / 111) * math.sin(math.radians(vehicle.bearing or 0)) / math.cos(math.radians(vehicle.current_lat))
                
                new_lat = vehicle.current_lat + lat_change
                new_lng = vehicle.current_lng + lng_change
                
                # Keep within Kigali bounds
                if new_lat < KIGALI_BOUNDS['min_lat'] or new_lat > KIGALI_BOUNDS['max_lat']:
                    vehicle.bearing = (vehicle.bearing + 180) % 360  # Reverse direction
                    new_lat = vehicle.current_lat
                
                if new_lng < KIGALI_BOUNDS['min_lng'] or new_lng > KIGALI_BOUNDS['max_lng']:
                    vehicle.bearing = (vehicle.bearing + 180) % 360  # Reverse direction
                    new_lng = vehicle.current_lng
                
                # Occasionally change direction (10% chance)
                if random.random() < 0.1:
                    vehicle.bearing = (vehicle.bearing + random.uniform(-45, 45)) % 360
                
                # Occasionally change speed (5% chance)
                if random.random() < 0.05:
                    if vehicle.vehicle_type == 'bus':
                        vehicle.speed = random.uniform(20, 40)
                    elif vehicle.vehicle_type == 'taxi':
                        vehicle.speed = random.uniform(30, 50)
                    elif vehicle.vehicle_type == 'moto':
                        vehicle.speed = random.uniform(40, 60)
                
                vehicle.current_lat = new_lat
                vehicle.current_lng = new_lng
            
            vehicle.last_seen = datetime.utcnow()
            vehicle.updated_at = datetime.utcnow()
            moved_count += 1
        
        db.session.commit()
        
        return {
            'message': f'Simulated movement for {moved_count} vehicles',
            'moved_count': moved_count,
            'timestamp': datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error simulating vehicle movement: {str(e)}')
        return {
            'error': 'Failed to simulate vehicle movement',
            'message': str(e)
        }


@simulation_bp.route('/vehicles/simulate', methods=['POST'])
def simulate_movement():
    """Endpoint to trigger vehicle movement simulation"""
    result = simulate_vehicle_movement()
    
    if 'error' in result:
        return jsonify(result), 500
    
    return jsonify(result), 200


@simulation_bp.route('/vehicles/auto-simulate/start', methods=['POST'])
def start_auto_simulation():
    """Start automatic vehicle movement simulation (runs every 30 seconds)"""
    # In production, this would use a background task scheduler
    # For now, return instructions
    return jsonify({
        'message': 'Auto-simulation started',
        'instructions': 'Call /api/v1/simulation/vehicles/simulate every 30 seconds',
        'note': 'In production, use Celery or similar task scheduler'
    }), 200

