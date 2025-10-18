"""
Fare rule model for KigaliGo application
"""

from . import db
from datetime import datetime

class FareRule(db.Model):
    """Fare rule model for different transport modes"""
    __tablename__ = 'fare_rules'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Transport mode
    mode = db.Column(db.Enum('bus', 'taxi', 'moto', name='transport_mode'), nullable=False)
    
    # Fare structure
    base_fare = db.Column(db.Float, nullable=False, default=0.0)  # Fixed starting fare
    per_km_rate = db.Column(db.Float, nullable=False, default=0.0)  # Rate per kilometer
    per_minute_rate = db.Column(db.Float, nullable=False, default=0.0)  # Rate per minute
    
    # Currency
    currency = db.Column(db.String(3), default='RWF')  # Rwandan Franc
    
    # Conditions
    minimum_fare = db.Column(db.Float, nullable=False, default=0.0)
    maximum_fare = db.Column(db.Float, nullable=True)
    peak_hour_multiplier = db.Column(db.Float, default=1.0)
    night_multiplier = db.Column(db.Float, default=1.0)
    
    # Time restrictions
    peak_start_time = db.Column(db.String(5), default='07:00')  # HH:MM format
    peak_end_time = db.Column(db.String(5), default='09:00')
    night_start_time = db.Column(db.String(5), default='22:00')
    night_end_time = db.Column(db.String(5), default='06:00')
    
    # Zone-specific pricing (optional)
    zone_id = db.Column(db.Integer, db.ForeignKey('zones.id'), nullable=True)
    zone_multiplier = db.Column(db.Float, default=1.0)
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    effective_from = db.Column(db.DateTime, default=datetime.utcnow)
    effective_until = db.Column(db.DateTime, nullable=True)
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def calculate_fare(self, distance_km, duration_minutes, start_time=None):
        """Calculate fare based on distance, duration, and time"""
        import datetime as dt
        
        # Base fare
        fare = self.base_fare
        
        # Distance component
        fare += distance_km * self.per_km_rate
        
        # Time component
        fare += duration_minutes * self.per_minute_rate
        
        # Apply time-based multipliers
        if start_time:
            current_time = start_time.time() if hasattr(start_time, 'time') else start_time
            
            # Peak hour multiplier
            if self.is_peak_hour(current_time):
                fare *= self.peak_hour_multiplier
            
            # Night multiplier
            if self.is_night_time(current_time):
                fare *= self.night_multiplier
        
        # Apply zone multiplier
        if self.zone_multiplier != 1.0:
            fare *= self.zone_multiplier
        
        # Apply minimum and maximum fare limits
        fare = max(fare, self.minimum_fare)
        if self.maximum_fare:
            fare = min(fare, self.maximum_fare)
        
        return round(fare, 2)
    
    def is_peak_hour(self, current_time):
        """Check if current time is within peak hours"""
        try:
            peak_start = dt.time.fromisoformat(self.peak_start_time)
            peak_end = dt.time.fromisoformat(self.peak_end_time)
            
            if peak_start <= peak_end:
                return peak_start <= current_time <= peak_end
            else:
                # Peak hours span midnight
                return current_time >= peak_start or current_time <= peak_end
        except:
            return False
    
    def is_night_time(self, current_time):
        """Check if current time is within night hours"""
        try:
            night_start = dt.time.fromisoformat(self.night_start_time)
            night_end = dt.time.fromisoformat(self.night_end_time)
            
            if night_start <= night_end:
                return night_start <= current_time <= night_end
            else:
                # Night hours span midnight
                return current_time >= night_start or current_time <= night_end
        except:
            return False
    
    def to_dict(self):
        """Convert to dictionary for API responses"""
        return {
            'id': self.id,
            'mode': self.mode,
            'base_fare': self.base_fare,
            'per_km_rate': self.per_km_rate,
            'per_minute_rate': self.per_minute_rate,
            'currency': self.currency,
            'minimum_fare': self.minimum_fare,
            'maximum_fare': self.maximum_fare,
            'peak_hour_multiplier': self.peak_hour_multiplier,
            'night_multiplier': self.night_multiplier,
            'peak_hours': f"{self.peak_start_time}-{self.peak_end_time}",
            'night_hours': f"{self.night_start_time}-{self.night_end_time}",
            'zone_id': self.zone_id,
            'zone_multiplier': self.zone_multiplier,
            'is_active': self.is_active,
            'effective_from': self.effective_from.isoformat() if self.effective_from else None,
            'effective_until': self.effective_until.isoformat() if self.effective_until else None
        }
    
    @classmethod
    def get_active_rules(cls, mode=None, zone_id=None):
        """Get active fare rules with optional filtering"""
        query = cls.query.filter(
            cls.is_active == True,
            cls.effective_from <= datetime.utcnow(),
            (cls.effective_until.is_(None)) | (cls.effective_until > datetime.utcnow())
        )
        
        if mode:
            query = query.filter_by(mode=mode)
        
        if zone_id:
            query = query.filter(cls.zone_id.is_(None) | (cls.zone_id == zone_id))
        
        return query.all()
    
    def __repr__(self):
        return f'<FareRule {self.mode}: {self.base_fare} + {self.per_km_rate}/km + {self.per_minute_rate}/min>'
