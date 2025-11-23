"""
Report model for KigaliGo application
"""

from . import db
from datetime import datetime

class Report(db.Model):
    """Report model for passenger feedback and safety reports"""
    __tablename__ = 'reports'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # User relationship (optional for anonymous reports)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    
    # Report details
    report_type = db.Column(db.Enum('overcharge', 'safety', 'service', 'other', name='report_type'),
                           nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    
    # Location
    lat = db.Column(db.Float, nullable=True)
    lng = db.Column(db.Float, nullable=True)
    address = db.Column(db.String(500), nullable=True)
    
    # Vehicle information (if applicable)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id'), nullable=True)
    vehicle_registration = db.Column(db.String(20), nullable=True)
    
    # Media
    photo_path = db.Column(db.String(500), nullable=True)
    photo_url = db.Column(db.String(500), nullable=True)
    
    # Status
    status = db.Column(db.Enum('pending', 'in_review', 'resolved', 'dismissed', name='report_status'),
                      default='pending')
    priority = db.Column(db.Enum('low', 'medium', 'high', 'urgent', name='report_priority'),
                        default='medium')
    
    # Admin response
    admin_response = db.Column(db.Text, nullable=True)
    admin_notes = db.Column(db.Text, nullable=True)
    resolved_by = db.Column(db.String(100), nullable=True)
    resolved_at = db.Column(db.DateTime, nullable=True)
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    vehicle = db.relationship('Vehicle', backref='reports', lazy=True)
    
    def to_dict(self, include_admin_fields=False):
        """Convert to dictionary for API responses"""
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'report_type': self.report_type,
            'title': self.title,
            'description': self.description,
            'lat': self.lat,
            'lng': self.lng,
            'address': self.address,
            'vehicle_id': self.vehicle_id,
            'vehicle_registration': self.vehicle_registration,
            'photo_url': self.photo_url,
            'status': self.status,
            'priority': self.priority,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        
        if include_admin_fields:
            data.update({
                'admin_response': self.admin_response,
                'admin_notes': self.admin_notes,
                'resolved_by': self.resolved_by,
                'resolved_at': self.resolved_at.isoformat() if self.resolved_at else None,
                'updated_at': self.updated_at.isoformat() if self.updated_at else None
            })
        
        return data
    
    @classmethod
    def get_recent_reports(cls, limit=20, report_type=None):
        """Get recent reports with optional filtering"""
        query = cls.query.order_by(cls.created_at.desc())
        
        if report_type:
            query = query.filter_by(report_type=report_type)
        
        return query.limit(limit).all()
    
    @classmethod
    def get_reports_by_status(cls, status, limit=50):
        """Get reports by status"""
        return cls.query.filter_by(status=status)\
                       .order_by(cls.created_at.desc())\
                       .limit(limit)\
                       .all()
    
    @classmethod
    def get_statistics(cls):
        """Get report statistics"""
        total_reports = cls.query.count()
        pending_reports = cls.query.filter_by(status='pending').count()
        resolved_reports = cls.query.filter_by(status='resolved').count()
        
        # Reports by type
        type_stats = db.session.query(
            cls.report_type,
            db.func.count(cls.id).label('count')
        ).group_by(cls.report_type).all()
        
        return {
            'total_reports': total_reports,
            'pending_reports': pending_reports,
            'resolved_reports': resolved_reports,
            'by_type': {stat.report_type: stat.count for stat in type_stats}
        }
    
    def __repr__(self):
        return f'<Report {self.id}: {self.title} ({self.report_type})>'
