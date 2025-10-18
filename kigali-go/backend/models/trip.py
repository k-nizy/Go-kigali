"""
Trip model for KigaliGo application
"""

from . import db
from datetime import datetime

class Trip(db.Model):
    """Trip model for user trip records"""
    __tablename__ = 'trips'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # User relationship (optional for anonymous trips)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    
    # Vehicle relationship (optional)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id'), nullable=True)
    
    # Origin and destination
    origin_lat = db.Column(db.Float, nullable=False)
    origin_lng = db.Column(db.Float, nullable=False)
    origin_address = db.Column(db.String(500), nullable=True)
    destination_lat = db.Column(db.Float, nullable=False)
    destination_lng = db.Column(db.Float, nullable=False)
    destination_address = db.Column(db.String(500), nullable=True)
    
    # Zone relationships
    origin_zone_id = db.Column(db.Integer, db.ForeignKey('zones.id'), nullable=True)
    destination_zone_id = db.Column(db.Integer, db.ForeignKey('zones.id'), nullable=True)
    
    # Trip details
    distance_km = db.Column(db.Float, nullable=False)
    duration_minutes = db.Column(db.Float, nullable=False)
    mode = db.Column(db.Enum('bus', 'taxi', 'moto', 'combined', name='transport_mode'), 
                    nullable=False)
    
    # Fare information
    estimated_fare = db.Column(db.Float, nullable=True)
    actual_fare = db.Column(db.Float, nullable=True)
    fare_breakdown = db.Column(db.Text, nullable=True)  # JSON string
    
    # Route information
    route_polyline = db.Column(db.Text, nullable=True)  # Encoded polyline
    route_steps = db.Column(db.Text, nullable=True)  # JSON string of route steps
    
    # Status
    status = db.Column(db.Enum('planned', 'in_progress', 'completed', 'cancelled', name='trip_status'),
                      default='planned')
    
    # Timestamps
    planned_start_time = db.Column(db.DateTime, nullable=True)
    actual_start_time = db.Column(db.DateTime, nullable=True)
    actual_end_time = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert to dictionary for API responses"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'vehicle_id': self.vehicle_id,
            'origin': {
                'lat': self.origin_lat,
                'lng': self.origin_lng,
                'address': self.origin_address,
                'zone': self.origin_zone.name if self.origin_zone else None
            },
            'destination': {
                'lat': self.destination_lat,
                'lng': self.destination_lng,
                'address': self.destination_address,
                'zone': self.destination_zone.name if self.destination_zone else None
            },
            'distance_km': self.distance_km,
            'duration_minutes': self.duration_minutes,
            'mode': self.mode,
            'estimated_fare': self.estimated_fare,
            'actual_fare': self.actual_fare,
            'status': self.status,
            'planned_start_time': self.planned_start_time.isoformat() if self.planned_start_time else None,
            'actual_start_time': self.actual_start_time.isoformat() if self.actual_start_time else None,
            'actual_end_time': self.actual_end_time.isoformat() if self.actual_end_time else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    @classmethod
    def get_user_trips(cls, user_id, limit=10, offset=0):
        """Get user's trip history"""
        return cls.query.filter_by(user_id=user_id)\
                       .order_by(cls.created_at.desc())\
                       .limit(limit)\
                       .offset(offset)\
                       .all()
    
    @classmethod
    def get_zone_statistics(cls, zone_id=None):
        """Get trip statistics for a zone"""
        query = cls.query
        
        if zone_id:
            query = query.filter(
                (cls.origin_zone_id == zone_id) | 
                (cls.destination_zone_id == zone_id)
            )
        
        total_trips = query.count()
        avg_distance = query.with_entities(db.func.avg(cls.distance_km)).scalar() or 0
        avg_duration = query.with_entities(db.func.avg(cls.duration_minutes)).scalar() or 0
        avg_fare = query.with_entities(db.func.avg(cls.estimated_fare)).scalar() or 0
        
        return {
            'total_trips': total_trips,
            'average_distance_km': round(avg_distance, 2),
            'average_duration_minutes': round(avg_duration, 2),
            'average_fare': round(avg_fare, 2)
        }
    
    def __repr__(self):
        return f'<Trip {self.id}: {self.origin_address} -> {self.destination_address}>'
