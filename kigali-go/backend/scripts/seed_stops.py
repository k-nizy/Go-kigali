"""
Seed database with realistic stops in Kigali
Run this script to populate stops data
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from app.extensions import db
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

def seed_stops():
    """Seed stops in database"""
    app = create_app()
    
    with app.app_context():
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
        print(f"Created {created_count} stops")
        print(f"Total stops in database: {Stop.query.count()}")
        return created_count

if __name__ == '__main__':
    seed_stops()

