"""
User model for KigaliGo application
"""

from . import db
from datetime import datetime
import bcrypt
import uuid

class User(db.Model):
    """User model for passenger accounts"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), unique=True, index=True, nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=True)
    password_hash = db.Column(db.String(128), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    is_email_verified = db.Column(db.Boolean, default=False)
    preferred_language = db.Column(db.String(5), default='en')  # en, rw
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    trips = db.relationship('Trip', backref='user', lazy=True)
    reports = db.relationship('Report', backref='user', lazy=True)
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        """Check password against hash"""
        if not self.password_hash:
            return False
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def to_dict(self):
        """Convert to dictionary for API responses"""
        return {
            'id': self.id,
            'uuid': self.uuid,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'is_active': self.is_active,
            'is_email_verified': self.is_email_verified,
            'preferred_language': self.preferred_language,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }
    
    @classmethod
    def find_by_email(cls, email):
        """Find a user by email (case-insensitive)."""
        if not email:
            return None
        # Use db.session.query to ensure we're using the correct db instance
        from flask import current_app
        from app.extensions import db as app_db
        return app_db.session.query(cls).filter(app_db.func.lower(cls.email) == email.lower()).first()

    # Backwards-compatible alias for legacy code
    @property
    def is_verified(self):  # pragma: no cover - alias for legacy callers
        return self.is_email_verified

    @is_verified.setter
    def is_verified(self, value):  # pragma: no cover - alias for legacy callers
        self.is_email_verified = value

    def __repr__(self):
        return f'<User {self.name} ({self.email or self.phone})>'
