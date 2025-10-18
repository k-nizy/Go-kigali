"""
Zone model for KigaliGo application
"""

from . import db
from datetime import datetime
from geoalchemy2 import Geometry

class Zone(db.Model):
    """Zone model for Kigali sectors/districts"""
    __tablename__ = 'zones'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    code = db.Column(db.String(10), nullable=True)  # Short code like 'KMR' for Kimironko
    district = db.Column(db.String(50), nullable=True)  # Kicukiro, Gasabo, Nyarugenge
    
    # Geographic data
    center_lat = db.Column(db.Float, nullable=False)
    center_lng = db.Column(db.Float, nullable=False)
    boundary = db.Column(Geometry('POLYGON'), nullable=True)
    
    # Metadata
    population = db.Column(db.Integer, nullable=True)
    area_km2 = db.Column(db.Float, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    stops = db.relationship('Stop', backref='zone', lazy=True)
    trips_from = db.relationship('Trip', foreign_keys='Trip.origin_zone_id', backref='origin_zone', lazy=True)
    trips_to = db.relationship('Trip', foreign_keys='Trip.destination_zone_id', backref='destination_zone', lazy=True)
    
    def to_dict(self):
        """Convert to dictionary for API responses"""
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'district': self.district,
            'center_lat': self.center_lat,
            'center_lng': self.center_lng,
            'population': self.population,
            'area_km2': self.area_km2,
            'is_active': self.is_active,
            'stops_count': len(self.stops) if self.stops else 0
        }
    
    @classmethod
    def find_zone_by_location(cls, lat, lng):
        """Find zone containing given coordinates"""
        # Simple bounding box search - in production, use PostGIS spatial queries
        zones = cls.query.filter(
            cls.center_lat - 0.01 <= lat <= cls.center_lat + 0.01,
            cls.center_lng - 0.01 <= lng <= cls.center_lng + 0.01,
            cls.is_active == True
        ).all()
        
        if zones:
            # Return closest zone by distance
            min_distance = float('inf')
            closest_zone = None
            
            for zone in zones:
                distance = ((lat - zone.center_lat) ** 2 + (lng - zone.center_lng) ** 2) ** 0.5
                if distance < min_distance:
                    min_distance = distance
                    closest_zone = zone
            
            return closest_zone
        
        return None
    
    def __repr__(self):
        return f'<Zone {self.name} ({self.district})>'
