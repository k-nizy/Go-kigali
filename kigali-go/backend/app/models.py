"""
Database models for authentication system
"""
from datetime import datetime
from app.extensions import db, bcrypt
from typing import Optional


class User(db.Model):
    """User model for authentication"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(150), nullable=True)
    is_active = db.Column(db.Boolean(), default=True, nullable=False)
    is_email_verified = db.Column(db.Boolean(), default=False, nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow, nullable=False)
    last_login = db.Column(db.DateTime(), nullable=True)
    
    def __repr__(self) -> str:
        return f'<User {self.email}>'
    
    def set_password(self, password: str) -> None:
        """Hash and set password"""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password: str) -> bool:
        """Verify password against hash"""
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def to_dict(self) -> dict:
        """Convert user to dictionary (exclude sensitive fields)"""
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'is_email_verified': self.is_email_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }
    
    @classmethod
    def find_by_email(cls, email: str) -> Optional['User']:
        """Find user by email (case-insensitive)"""
        return cls.query.filter(db.func.lower(cls.email) == email.lower()).first()


class TokenBlocklist(db.Model):
    """Store revoked JWT tokens"""
    __tablename__ = 'token_blocklist'
    
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True, unique=True)
    token_type = db.Column(db.String(10), nullable=False)  # 'access' or 'refresh'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow, nullable=False)
    
    def __repr__(self) -> str:
        return f'<TokenBlocklist {self.jti}>'
    
    @classmethod
    def is_jti_blocklisted(cls, jti: str) -> bool:
        """Check if a token JTI is blocklisted"""
        return cls.query.filter_by(jti=jti).first() is not None
    
    @classmethod
    def add_to_blocklist(cls, jti: str, token_type: str, user_id: int) -> None:
        """Add token to blocklist"""
        blocklisted_token = cls(jti=jti, token_type=token_type, user_id=user_id)
        db.session.add(blocklisted_token)
        db.session.commit()


class PasswordResetToken(db.Model):
    """Store password reset tokens"""
    __tablename__ = 'password_reset_tokens'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    token = db.Column(db.String(100), nullable=False, unique=True, index=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow, nullable=False)
    used_at = db.Column(db.DateTime(), nullable=True)
    
    user = db.relationship('User', backref=db.backref('reset_tokens', lazy=True))
    
    def __repr__(self) -> str:
        return f'<PasswordResetToken {self.token}>'
    
    @classmethod
    def find_valid_token(cls, token: str) -> Optional['PasswordResetToken']:
        """Find valid (unused and not expired) reset token"""
        from app.config import Config
        from datetime import datetime, timedelta
        
        expiry_time = datetime.utcnow() - Config.PASSWORD_RESET_TOKEN_EXPIRES
        return cls.query.filter(
            cls.token == token,
            cls.used_at.is_(None),
            cls.created_at > expiry_time
        ).first()


class EmailVerificationToken(db.Model):
    """Store email verification tokens"""
    __tablename__ = 'email_verification_tokens'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    token = db.Column(db.String(100), nullable=False, unique=True, index=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow, nullable=False)
    verified_at = db.Column(db.DateTime(), nullable=True)
    
    user = db.relationship('User', backref=db.backref('verification_tokens', lazy=True))
    
    def __repr__(self) -> str:
        return f'<EmailVerificationToken {self.token}>'
    
    @classmethod
    def find_valid_token(cls, token: str) -> Optional['EmailVerificationToken']:
        """Find valid (unused and not expired) verification token"""
        from app.config import Config
        from datetime import datetime, timedelta
        
        expiry_time = datetime.utcnow() - Config.EMAIL_VERIFICATION_TOKEN_EXPIRES
        return cls.query.filter(
            cls.token == token,
            cls.verified_at.is_(None),
            cls.created_at > expiry_time
        ).first()
