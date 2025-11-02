"""
Database seeding script for KigaliGo application
Populates database with Kigali-specific zones, stops, and sample data
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app import create_app
from backend.models import db, Zone, Stop, Vehicle, FareRule, User
from datetime import datetime
import random

def seed_zones():
    """Seed Kigali zones with realistic coordinates"""
    zones_data = [
        # Gasabo District
        {'name': 'Kimironko', 'code': 'KMR', 'district': 'Gasabo', 'center_lat': -1.9307, 'center_lng': 30.1182, 'population': 45000},
        {'name': 'Kacyiru', 'code': 'KCY', 'district': 'Gasabo', 'center_lat': -1.9441, 'center_lng': 30.0619, 'population': 35000},
        {'name': 'Remera', 'code': 'RMR', 'district': 'Gasabo', 'center_lat': -1.9526, 'center_lng': 30.0953, 'population': 40000},
        {'name': 'Kinyinya', 'code': 'KNY', 'district': 'Gasabo', 'center_lat': -1.9044, 'center_lng': 30.0889, 'population': 38000},
        
        # Kicukiro District
        {'name': 'Kicukiro', 'code': 'KCK', 'district': 'Kicukiro', 'center_lat': -1.9706, 'center_lng': 30.1044, 'population': 32000},
        {'name': 'Gikondo', 'code': 'GKD', 'district': 'Kicukiro', 'center_lat': -1.9889, 'center_lng': 30.0778, 'population': 28000},
        {'name': 'Nyarugunga', 'code': 'NRG', 'district': 'Kicukiro', 'center_lat': -2.0222, 'center_lng': 30.1111, 'population': 25000},
        
        # Nyarugenge District
        {'name': 'Nyabugogo', 'code': 'NBG', 'district': 'Nyarugenge', 'center_lat': -1.9444, 'center_lng': 30.0444, 'population': 55000},
        {'name': 'Nyamirambo', 'code': 'NMB', 'district': 'Nyarugenge', 'center_lat': -1.9556, 'center_lng': 30.0556, 'population': 42000},
        {'name': 'Gitega', 'code': 'GTG', 'district': 'Nyarugenge', 'center_lat': -1.9667, 'center_lng': 30.0333, 'population': 30000},
    ]
    
    created_count = 0
    for zone_data in zones_data:
        existing = Zone.query.filter_by(name=zone_data['name']).first()
        if not existing:
            zone = Zone(**zone_data)
            db.session.add(zone)
            created_count += 1
    
    db.session.commit()
    print(f"Created {created_count} zones")
    return created_count

def seed_stops():
    """Seed bus stops and taxi stands"""
    stops_data = [
        # Major bus stops in Nyabugogo
        {'name': 'Nyabugogo Bus Terminal', 'code': 'NBG001', 'lat': -1.9444, 'lng': 30.0444, 'zone_name': 'Nyabugogo', 'stop_type': 'combined'},
        {'name': 'Nyabugogo Taxi Park', 'code': 'NBG002', 'lat': -1.9456, 'lng': 30.0456, 'zone_name': 'Nyabugogo', 'stop_type': 'taxi'},
        {'name': 'Nyabugogo Moto Stand', 'code': 'NBG003', 'lat': -1.9433, 'lng': 30.0433, 'zone_name': 'Nyabugogo', 'stop_type': 'moto'},
        
        # Kimironko stops
        {'name': 'Kimironko Market', 'code': 'KMR001', 'lat': -1.9307, 'lng': 30.1182, 'zone_name': 'Kimironko', 'stop_type': 'combined'},
        {'name': 'Kimironko Bus Stop', 'code': 'KMR002', 'lat': -1.9297, 'lng': 30.1172, 'zone_name': 'Kimironko', 'stop_type': 'bus'},
        
        # Kacyiru stops
        {'name': 'Kacyiru Roundabout', 'code': 'KCY001', 'lat': -1.9441, 'lng': 30.0619, 'zone_name': 'Kacyiru', 'stop_type': 'combined'},
        {'name': 'Kacyiru Taxi Stand', 'code': 'KCY002', 'lat': -1.9451, 'lng': 30.0629, 'zone_name': 'Kacyiru', 'stop_type': 'taxi'},
        
        # Remera stops
        {'name': 'Remera Market', 'code': 'RMR001', 'lat': -1.9526, 'lng': 30.0953, 'zone_name': 'Remera', 'stop_type': 'combined'},
        {'name': 'Remera Bus Stop', 'code': 'RMR002', 'lat': -1.9516, 'lng': 30.0943, 'zone_name': 'Remera', 'stop_type': 'bus'},
        
        # Kicukiro stops
        {'name': 'Kicukiro Center', 'code': 'KCK001', 'lat': -1.9706, 'lng': 30.1044, 'zone_name': 'Kicukiro', 'stop_type': 'combined'},
        {'name': 'Kicukiro Taxi Park', 'code': 'KCK002', 'lat': -1.9716, 'lng': 30.1054, 'zone_name': 'Kicukiro', 'stop_type': 'taxi'},
        
        # Nyamirambo stops
        {'name': 'Nyamirambo Market', 'code': 'NMB001', 'lat': -1.9556, 'lng': 30.0556, 'zone_name': 'Nyamirambo', 'stop_type': 'combined'},
        {'name': 'Nyamirambo Bus Stop', 'code': 'NMB002', 'lat': -1.9546, 'lng': 30.0546, 'zone_name': 'Nyamirambo', 'stop_type': 'bus'},
        
        # Additional stops
        {'name': 'Gitega Center', 'code': 'GTG001', 'lat': -1.9667, 'lng': 30.0333, 'zone_name': 'Gitega', 'stop_type': 'combined'},
        {'name': 'Gikondo Market', 'code': 'GKD001', 'lat': -1.9889, 'lng': 30.0778, 'zone_name': 'Gikondo', 'stop_type': 'combined'},
        {'name': 'Kinyinya Market', 'code': 'KNY001', 'lat': -1.9044, 'lng': 30.0889, 'zone_name': 'Kinyinya', 'stop_type': 'combined'},
        {'name': 'Nyarugunga Center', 'code': 'NRG001', 'lat': -2.0222, 'lng': 30.1111, 'zone_name': 'Nyarugunga', 'stop_type': 'combined'},
    ]
    
    created_count = 0
    for stop_data in stops_data:
        existing = Stop.query.filter_by(code=stop_data['code']).first()
        if not existing:
            # Find zone
            zone = Zone.query.filter_by(name=stop_data['zone_name']).first()
            if zone:
                stop = Stop(
                    name=stop_data['name'],
                    code=stop_data['code'],
                    lat=stop_data['lat'],
                    lng=stop_data['lng'],
                    zone_id=zone.id,
                    stop_type=stop_data['stop_type'],
                    facilities='shelter,seating',
                    is_shelter=True,
                    operating_hours='05:00-23:00'
                )
                db.session.add(stop)
                created_count += 1
    
    db.session.commit()
    print(f"Created {created_count} stops")
    return created_count

def seed_vehicles():
    """Seed vehicles with realistic Kigali data"""
    vehicles_data = [
        # Tap&Go Buses
        {'vehicle_type': 'bus', 'registration': 'RAB001A', 'operator': 'Tap&Go', 'capacity': 50, 'fuel_type': 'diesel', 'route_id': 'RT001', 'route_name': 'Nyabugogo - Kacyiru'},
        {'vehicle_type': 'bus', 'registration': 'RAB002A', 'operator': 'Tap&Go', 'capacity': 50, 'fuel_type': 'diesel', 'route_id': 'RT002', 'route_name': 'Kimironko - Nyabugogo'},
        {'vehicle_type': 'bus', 'registration': 'RAB003A', 'operator': 'Tap&Go', 'capacity': 50, 'fuel_type': 'diesel', 'route_id': 'RT003', 'route_name': 'Remera - Kacyiru'},
        {'vehicle_type': 'bus', 'registration': 'RAB004A', 'operator': 'Tap&Go', 'capacity': 50, 'fuel_type': 'electric', 'route_id': 'RT004', 'route_name': 'Nyamirambo - Kimironko'},
        {'vehicle_type': 'bus', 'registration': 'RAB005A', 'operator': 'Tap&Go', 'capacity': 50, 'fuel_type': 'diesel', 'route_id': 'RT005', 'route_name': 'Kicukiro - Nyabugogo'},
        
        # Private Taxis
        {'vehicle_type': 'taxi', 'registration': 'RAB006A', 'operator': 'Private', 'capacity': 4, 'fuel_type': 'petrol'},
        {'vehicle_type': 'taxi', 'registration': 'RAB007A', 'operator': 'Private', 'capacity': 4, 'fuel_type': 'petrol'},
        {'vehicle_type': 'taxi', 'registration': 'RAB008A', 'operator': 'Private', 'capacity': 4, 'fuel_type': 'hybrid'},
        {'vehicle_type': 'taxi', 'registration': 'RAB009A', 'operator': 'Private', 'capacity': 4, 'fuel_type': 'petrol'},
        {'vehicle_type': 'taxi', 'registration': 'RAB010A', 'operator': 'Private', 'capacity': 4, 'fuel_type': 'electric'},
        
        # Motorcycle Taxis
        {'vehicle_type': 'moto', 'registration': 'RAB011A', 'operator': 'Private', 'capacity': 2, 'fuel_type': 'petrol'},
        {'vehicle_type': 'moto', 'registration': 'RAB012A', 'operator': 'Private', 'capacity': 2, 'fuel_type': 'petrol'},
        {'vehicle_type': 'moto', 'registration': 'RAB013A', 'operator': 'Private', 'capacity': 2, 'fuel_type': 'electric'},
        {'vehicle_type': 'moto', 'registration': 'RAB014A', 'operator': 'Private', 'capacity': 2, 'fuel_type': 'petrol'},
        {'vehicle_type': 'moto', 'registration': 'RAB015A', 'operator': 'Private', 'capacity': 2, 'fuel_type': 'petrol'},
    ]
    
    created_count = 0
    for vehicle_data in vehicles_data:
        existing = Vehicle.query.filter_by(registration=vehicle_data['registration']).first()
        if not existing:
            vehicle = Vehicle(**vehicle_data)
            
            # Set random location within Kigali
            vehicle.current_lat = -1.9441 + random.uniform(-0.08, 0.08)  # Kigali center ± 8km
            vehicle.current_lng = 30.0619 + random.uniform(-0.08, 0.08)
            vehicle.bearing = random.uniform(0, 360)
            vehicle.speed = random.uniform(20, 60)  # km/h
            vehicle.last_seen = datetime.utcnow()
            
            db.session.add(vehicle)
            created_count += 1
    
    db.session.commit()
    print(f"Created {created_count} vehicles")
    return created_count

def seed_fare_rules():
    """Seed fare rules for different transport modes"""
    fare_rules_data = [
        # Bus fare rules (Tap&Go)
        {
            'mode': 'bus',
            'base_fare': 500,
            'per_km_rate': 150,
            'per_minute_rate': 10,
            'minimum_fare': 500,
            'maximum_fare': 2000,
            'peak_hour_multiplier': 1.2,
            'night_multiplier': 1.5,
            'peak_start_time': '07:00',
            'peak_end_time': '09:00',
            'night_start_time': '22:00',
            'night_end_time': '06:00',
            'currency': 'RWF'
        },
        
        # Moto fare rules
        {
            'mode': 'moto',
            'base_fare': 800,
            'per_km_rate': 300,
            'per_minute_rate': 20,
            'minimum_fare': 800,
            'maximum_fare': 3000,
            'peak_hour_multiplier': 1.3,
            'night_multiplier': 1.8,
            'peak_start_time': '07:00',
            'peak_end_time': '09:00',
            'night_start_time': '22:00',
            'night_end_time': '06:00',
            'currency': 'RWF'
        },
        
        # Taxi fare rules
        {
            'mode': 'taxi',
            'base_fare': 1200,
            'per_km_rate': 400,
            'per_minute_rate': 30,
            'minimum_fare': 1200,
            'maximum_fare': 5000,
            'peak_hour_multiplier': 1.4,
            'night_multiplier': 2.0,
            'peak_start_time': '07:00',
            'peak_end_time': '09:00',
            'night_start_time': '22:00',
            'night_end_time': '06:00',
            'currency': 'RWF'
        },
    ]
    
    created_count = 0
    for rule_data in fare_rules_data:
        existing = FareRule.query.filter_by(mode=rule_data['mode']).first()
        if not existing:
            fare_rule = FareRule(**rule_data)
            db.session.add(fare_rule)
            created_count += 1
    
    db.session.commit()
    print(f"Created {created_count} fare rules")
    return created_count

def seed_sample_users():
    """Seed sample users for testing"""
    users_data = [
        {'name': 'Jean Baptiste', 'email': 'jean@example.com', 'phone': '0781234567', 'preferred_language': 'rw'},
        {'name': 'Grace Mukamana', 'email': 'grace@example.com', 'phone': '0782345678', 'preferred_language': 'en'},
        {'name': 'Paul Nkurunziza', 'email': 'paul@example.com', 'phone': '0783456789', 'preferred_language': 'rw'},
        {'name': 'Marie Claire', 'email': 'marie@example.com', 'phone': '0784567890', 'preferred_language': 'en'},
        {'name': 'Test User', 'email': 'test@kigali.go', 'phone': '0789999999', 'preferred_language': 'en'},
    ]
    
    created_count = 0
    for user_data in users_data:
        existing = User.query.filter(
            (User.email == user_data['email']) | (User.phone == user_data['phone'])
        ).first()
        if not existing:
            user = User(**user_data)
            user.set_password('password123')  # Default password for testing
            user.is_verified = True
            db.session.add(user)
            created_count += 1
    
    db.session.commit()
    print(f"Created {created_count} sample users")
    return created_count

def main():
    """Main seeding function"""
    app = create_app()
    
    with app.app_context():
        print("Starting database seeding...")
        
        # Create tables if they don't exist
        db.create_all()
        
        # Seed data
        zones_created = seed_zones()
        stops_created = seed_stops()
        vehicles_created = seed_vehicles()
        fare_rules_created = seed_fare_rules()
        users_created = seed_sample_users()
        
        print("\n=== Seeding Summary ===")
        print(f"Zones created: {zones_created}")
        print(f"Stops created: {stops_created}")
        print(f"Vehicles created: {vehicles_created}")
        print(f"Fare rules created: {fare_rules_created}")
        print(f"Sample users created: {users_created}")
        print("\nDatabase seeding completed successfully!")
        
        # Print some useful information
        print("\n=== Sample Data Info ===")
        print("Sample users (email: test@kigali.go, password: password123)")
        print("Major zones: Nyabugogo, Kimironko, Kacyiru, Remera, Kicukiro")
        print("Vehicle types: Bus (Tap&Go), Taxi, Moto")
        print("Fare rules: Bus (500-2000 RWF), Moto (800-3000 RWF), Taxi (1200-5000 RWF)")

if __name__ == '__main__':
    main()
    
