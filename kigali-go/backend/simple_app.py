"""
Simplified KigaliGo Backend for Quick Testing
This version uses SQLite instead of PostgreSQL for easier setup
"""

import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from datetime import datetime
import random

app = Flask(__name__)
CORS(app)

# Database setup
DATABASE = 'kigali_go.db'

def init_db():
    """Initialize SQLite database with sample data"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS vehicles (
            id INTEGER PRIMARY KEY,
            vehicle_type TEXT NOT NULL,
            registration TEXT UNIQUE NOT NULL,
            operator TEXT,
            current_lat REAL,
            current_lng REAL,
            is_active BOOLEAN DEFAULT 1,
            last_seen DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS zones (
            id INTEGER PRIMARY KEY,
            name TEXT UNIQUE NOT NULL,
            code TEXT,
            district TEXT,
            center_lat REAL NOT NULL,
            center_lng REAL NOT NULL
        )
    ''')
    
    # Insert sample data
    vehicles_data = [
        ('bus', 'RAB001A', 'Tap&Go', -1.9441, 30.0619),
        ('bus', 'RAB002A', 'Tap&Go', -1.9307, 30.1182),
        ('moto', 'RAB003A', 'Private', -1.9526, 30.0953),
        ('taxi', 'RAB004A', 'Private', -1.9706, 30.1044),
        ('moto', 'RAB005A', 'Private', -1.9556, 30.0556),
    ]
    
    zones_data = [
        ('Nyabugogo', 'NBG', 'Nyarugenge', -1.9444, 30.0444),
        ('Kimironko', 'KMR', 'Gasabo', -1.9307, 30.1182),
        ('Kacyiru', 'KCY', 'Gasabo', -1.9441, 30.0619),
        ('Remera', 'RMR', 'Gasabo', -1.9526, 30.0953),
        ('Kicukiro', 'KCK', 'Kicukiro', -1.9706, 30.1044),
    ]
    
    cursor.executemany('''
        INSERT OR REPLACE INTO vehicles (vehicle_type, registration, operator, current_lat, current_lng)
        VALUES (?, ?, ?, ?, ?)
    ''', vehicles_data)
    
    cursor.executemany('''
        INSERT OR REPLACE INTO zones (name, code, district, center_lat, center_lng)
        VALUES (?, ?, ?, ?, ?)
    ''', zones_data)
    
    conn.commit()
    conn.close()
    print("Database initialized with sample data!")

# Health check endpoint
@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'kigali-go-api',
        'version': '1.0.0'
    })

# API documentation endpoint
@app.route('/api/v1/docs')
def api_docs():
    return jsonify({
        'title': 'KigaliGo API Documentation',
        'version': '1.0.0',
        'endpoints': {
            'health': '/health',
            'statistics': '/api/v1/statistics',
            'vehicles': '/api/v1/vehicles/nearby',
            'zones': '/api/v1/zones',
            'fare': '/api/v1/fare/estimate'
        }
    })

@app.route('/api/v1/statistics')
def get_statistics():
    """Get system statistics"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) FROM vehicles WHERE is_active = 1')
    total_vehicles = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(*) FROM zones')
    total_zones = cursor.fetchone()[0]
    
    conn.close()
    
    return jsonify({
        'statistics': {
            'total_vehicles': total_vehicles,
            'active_vehicles': total_vehicles,
            'total_zones': total_zones,
            'total_stops': 18,
            'total_trips': 1250,
            'today_trips': 85
        },
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/v1/vehicles/nearby')
def get_nearby_vehicles():
    """Get nearby vehicles"""
    lat = float(request.args.get('lat', -1.9441))
    lng = float(request.args.get('lng', 30.0619))
    radius = float(request.args.get('radius', 5.0))
    vehicle_type = request.args.get('type')
    
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    query = 'SELECT * FROM vehicles WHERE is_active = 1'
    params = []
    
    if vehicle_type:
        query += ' AND vehicle_type = ?'
        params.append(vehicle_type)
    
    cursor.execute(query, params)
    vehicles = cursor.fetchall()
    conn.close()
    
    nearby_vehicles = []
    for vehicle in vehicles:
        # Calculate distance (simplified)
        distance = ((lat - vehicle[4]) ** 2 + (lng - vehicle[5]) ** 2) ** 0.5 * 111
        
        if distance <= radius:
            vehicle_dict = {
                'id': vehicle[0],
                'vehicle_type': vehicle[1],
                'registration': vehicle[2],
                'operator': vehicle[3],
                'current_lat': vehicle[4],
                'current_lng': vehicle[5],
                'distance_km': round(distance, 2),
                'eta_minutes': round(distance * 1.5, 1),
                'is_active': bool(vehicle[6]),
                'last_seen': vehicle[7]
            }
            nearby_vehicles.append(vehicle_dict)
    
    # Sort by distance
    nearby_vehicles.sort(key=lambda x: x['distance_km'])
    
    return jsonify({
        'vehicles': nearby_vehicles,
        'count': len(nearby_vehicles),
        'center': {'lat': lat, 'lng': lng},
        'radius_km': radius
    })

@app.route('/api/v1/zones')
def get_zones():
    """Get all zones"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM zones')
    zones = cursor.fetchall()
    conn.close()
    
    zones_list = []
    for zone in zones:
        zone_dict = {
            'id': zone[0],
            'name': zone[1],
            'code': zone[2],
            'district': zone[3],
            'center_lat': zone[4],
            'center_lng': zone[5],
            'population': random.randint(25000, 55000),
            'stops_count': random.randint(2, 5)
        }
        zones_list.append(zone_dict)
    
    return jsonify({
        'zones': zones_list,
        'count': len(zones_list)
    })

@app.route('/api/v1/fare/estimate')
def estimate_fare():
    """Estimate fare for a trip with detailed breakdown"""
    distance_km = float(request.args.get('distance_km', 0))
    duration_minutes = float(request.args.get('duration_minutes', 0))
    mode = request.args.get('mode', 'bus')
    
    if distance_km <= 0 or duration_minutes <= 0:
        return jsonify({'error': 'Distance and duration must be positive'}), 400
    
    # Base fares and rates by mode
    if mode == 'bus':
        base_fare = 500
        per_km_rate = 150
        per_minute_rate = 10
    elif mode == 'moto':
        base_fare = 800
        per_km_rate = 300
        per_minute_rate = 20
    elif mode == 'taxi':
        base_fare = 2000
        per_km_rate = 400
        per_minute_rate = 50
    else:
        base_fare = 1000
        per_km_rate = 200
        per_minute_rate = 15
    
    # Calculate fare components
    distance_fare = distance_km * per_km_rate
    time_fare = duration_minutes * per_minute_rate
    total_fare = base_fare + distance_fare + time_fare
    
    # Round to nearest 50 RWF for realistic pricing
    total_fare = round(total_fare / 50) * 50
    
    return jsonify({
        'fare': {
            'base_fare': int(base_fare),
            'distance_fare': int(round(distance_fare)),
            'time_fare': int(round(time_fare)),
            'total_fare': int(total_fare)
        },
        'mode': mode,
        'distance_km': distance_km,
        'duration_minutes': duration_minutes,
        'currency': 'RWF',
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/v1/routes/plan')
def plan_route():
    """Plan a route between two locations"""
    origin = request.args.get('origin')
    destination = request.args.get('destination')
    
    if not origin or not destination:
        return jsonify({'error': 'Origin and destination coordinates are required'}), 400
    
    try:
        origin_lat, origin_lng = map(float, origin.split(','))
        dest_lat, dest_lng = map(float, destination.split(','))
    except ValueError:
        return jsonify({'error': 'Invalid coordinate format'}), 400
    
    # Simple distance calculation
    distance_km = ((dest_lat - origin_lat) ** 2 + (dest_lng - origin_lng) ** 2) ** 0.5 * 111
    
    options = [
        {
            'mode': 'bus',
            'distance_km': round(distance_km, 2),
            'duration_minutes': round(distance_km * 2, 1),
            'estimated_fare': round(max(500, distance_km * 150)),
            'route_polyline': None,
            'steps': ['Take bus from origin', 'Transfer if needed', 'Arrive at destination']
        },
        {
            'mode': 'moto',
            'distance_km': round(distance_km, 2),
            'duration_minutes': round(distance_km * 1.5, 1),
            'estimated_fare': round(max(800, distance_km * 300)),
            'route_polyline': None,
            'steps': ['Take motorcycle taxi', 'Direct route to destination']
        },
        {
            'mode': 'taxi',
            'distance_km': round(distance_km, 2),
            'duration_minutes': round(distance_km * 1.8, 1),
            'estimated_fare': round(max(1200, distance_km * 400)),
            'route_polyline': None,
            'steps': ['Take taxi', 'Comfortable ride to destination']
        }
    ]
    
    return jsonify({
        'origin': {'lat': origin_lat, 'lng': origin_lng},
        'destination': {'lat': dest_lat, 'lng': dest_lng},
        'options': options,
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/v1/reports', methods=['POST'])
def submit_report():
    """Submit a user report about transport issues"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        report_type = data.get('type', 'other')
        title = data.get('title', '')
        description = data.get('description', '')
        
        # Either title or description must be provided
        if not title and not description:
            return jsonify({'error': 'Title or description is required'}), 400
        
        # Extract optional fields
        location = data.get('location', '')
        vehicle_registration = data.get('vehicle_registration', '')
        photo = data.get('photo')
        
        # In a real app, save to database
        # For now, just log and return success
        report_id = f"RPT-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
        
        print(f"📝 New Report Received:")
        print(f"   ID: {report_id}")
        print(f"   Type: {report_type}")
        print(f"   Title: {title}")
        print(f"   Description: {description}")
        print(f"   Location: {location}")
        print(f"   Vehicle: {vehicle_registration}")
        
        return jsonify({
            'success': True,
            'message': 'Report submitted successfully. Thank you for helping improve our service!',
            'report_id': report_id,
            'status': 'pending',
            'timestamp': datetime.utcnow().isoformat()
        }), 201
        
    except Exception as e:
        print(f"❌ Error submitting report: {e}")
        return jsonify({'error': 'Failed to submit report', 'details': str(e)}), 500

if __name__ == '__main__':
    # Initialize database
    init_db()
    
    print("🚀 Starting KigaliGo Backend Server...")
    print("📍 API Documentation: http://localhost:5000/api/v1/docs")
    print("❤️ Health Check: http://localhost:5000/health")
    print("🌍 Statistics: http://localhost:5000/api/v1/statistics")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
