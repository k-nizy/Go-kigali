"""
Stop model for KigaliGo application
"""

from . import db
from datetime import datetime
from geoalchemy2 import Geometry

class Stop(db.Model):
    """Stop model for bus stops and taxi stands"""
    __tablename__ = 'stops'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    code = db.Column(db.String(20), nullable=True)  # Stop code like 'NYB001' for Nyabugogo
    
    # Location
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)
    location = db.Column(Geometry('POINT'), nullable=True)
    
    # Zone relationship
    zone_id = db.Column(db.Integer, db.ForeignKey('zones.id'), nullable=False)
    
    # Stop details
    stop_type = db.Column(db.Enum('bus', 'taxi', 'moto', 'combined', name='stop_type'), 
                         nullable=False, default='bus')
    facilities = db.Column(db.Text, nullable=True)  # JSON string of facilities
    is_shelter = db.Column(db.Boolean, default=False)
    is_accessible = db.Column(db.Boolean, default=True)
    
    # Operational info
    is_active = db.Column(db.Boolean, default=True)
    operating_hours = db.Column(db.String(100), nullable=True)  # "06:00-22:00"
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert to dictionary for API responses"""
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'lat': self.lat,
            'lng': self.lng,
            'zone_id': self.zone_id,
            'zone_name': self.zone.name if self.zone else None,
            'stop_type': self.stop_type,
            'is_shelter': self.is_shelter,
            'is_accessible': self.is_accessible,
            'is_active': self.is_active,
            'operating_hours': self.operating_hours
        }
    
    @classmethod
    def find_nearby_stops(cls, lat, lng, radius_km=1.0, stop_type=None):
        """Find stops within radius of given location"""
        # Simple distance calculation - in production, use PostGIS spatial queries
        stops = cls.query.filter(cls.is_active == True).all()
        
        nearby_stops = []
        for stop in stops:
            # Calculate distance using Haversine formula (simplified)
            distance = ((lat - stop.lat) ** 2 + (lng - stop.lng) ** 2) ** 0.5 * 111  # Rough km conversion
            
            if distance <= radius_km:
                if stop_type is None or stop.stop_type == stop_type or stop.stop_type == 'combined':
                    stop_dict = stop.to_dict()
                    stop_dict['distance_km'] = round(distance, 2)
                    nearby_stops.append(stop_dict)
        
        # Sort by distance
        nearby_stops.sort(key=lambda x: x['distance_km'])
        return nearby_stops
    
    def __repr__(self):
        return f'<Stop {self.name} ({self.code})>'
