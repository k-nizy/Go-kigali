"""
Vehicle model for KigaliGo application
"""

from . import db
from datetime import datetime
from geoalchemy2 import Geometry
from sqlalchemy import func, CheckConstraint

class Vehicle(db.Model):
    """Vehicle model for buses, taxis, and motorcycles"""
    __tablename__ = 'vehicles'
    __table_args__ = (
        db.Index('ix_vehicles_active', 'is_active'),
        db.Index('ix_vehicles_vehicle_type', 'vehicle_type'),
        db.Index('ix_vehicles_lat_lng', 'current_lat', 'current_lng'),
        CheckConstraint('bearing >= 0 AND bearing < 360', name='ck_vehicles_bearing_range'),
    )
    
    id = db.Column(db.Integer, primary_key=True)
    vehicle_type = db.Column(db.Enum('bus', 'taxi', 'moto', name='vehicle_type'), nullable=False)
    registration = db.Column(db.String(20), unique=True, nullable=False)
    operator = db.Column(db.String(100), nullable=True)  # Tap&Go, private, etc.
    driver_name = db.Column(db.String(100), nullable=True)
    driver_phone = db.Column(db.String(20), nullable=True)
    capacity = db.Column(db.Integer, nullable=False, default=1)
    fuel_type = db.Column(db.String(20), nullable=True)  # petrol, electric, hybrid
    
    # Location data
    current_lat = db.Column(db.Float, nullable=True)
    current_lng = db.Column(db.Float, nullable=True)
    location = db.Column(Geometry('POINT'), nullable=True)
    bearing = db.Column(db.Float, nullable=True)  # Direction in degrees
    speed = db.Column(db.Float, nullable=True)  # km/h
    
    # Route information
    route_id = db.Column(db.String(50), nullable=True)
    route_name = db.Column(db.String(100), nullable=True)
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    is_available = db.Column(db.Boolean, default=True)
    last_seen = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    trips = db.relationship('Trip', backref='vehicle', lazy=True)
    
    def update_location(self, lat, lng, bearing=None, speed=None):
        """Update vehicle location"""
        self.current_lat = lat
        self.current_lng = lng
        if bearing is not None:
            try:
                # Normalize and clamp to [0, 360)
                b = float(bearing) % 360.0
                # guard against 360 edge case
                if b == 360.0:
                    b = 0.0
                self.bearing = b
            except Exception:
                self.bearing = None
        self.speed = speed
        self.last_seen = datetime.utcnow()
        
        # Update PostGIS geometry if available
        if hasattr(db, 'func'):
            self.location = db.func.ST_SetSRID(
                db.func.ST_MakePoint(lng, lat), 4326
            )
    
    def to_dict(self):
        """Convert to dictionary for API responses"""
        return {
            'id': self.id,
            'vehicle_type': self.vehicle_type,
            'registration': self.registration,
            'operator': self.operator,
            'driver_name': self.driver_name,
            'driver_phone': self.driver_phone,
            'capacity': self.capacity,
            'fuel_type': self.fuel_type,
            'current_lat': self.current_lat,
            'current_lng': self.current_lng,
            'bearing': self.bearing,
            'speed': self.speed,
            'route_id': self.route_id,
            'route_name': self.route_name,
            'is_active': self.is_active,
            'is_available': self.is_available,
            'last_seen': self.last_seen.isoformat() if self.last_seen else None
        }
    
    def __repr__(self):
        return f'<Vehicle {self.registration} ({self.vehicle_type})>'
