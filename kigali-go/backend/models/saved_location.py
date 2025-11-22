"""
Saved Location model for user's favorite places (home, work, etc.)
"""

from . import db
from datetime import datetime

class SavedLocation(db.Model):
    """Saved location model for user's favorite places"""
    __tablename__ = 'saved_locations'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Location details
    name = db.Column(db.String(100), nullable=False)  # "Home", "Work", "Custom Name"
    location_type = db.Column(db.Enum('home', 'work', 'custom', name='location_type'), 
                            nullable=False, default='custom')
    
    # Address and coordinates
    address = db.Column(db.String(255), nullable=True)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)
    
    # Metadata
    is_default = db.Column(db.Boolean, default=False)  # Default origin/destination
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='saved_locations')
    
    def to_dict(self):
        """Convert to dictionary for API responses""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'location_type': self.location_type,
            'address': self.address,
            'lat': self.lat,
            'lng': self.lng,
            'is_default': self.is_default,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<SavedLocation {self.name} ({self.location_type}) for user {self.user_id}>'



