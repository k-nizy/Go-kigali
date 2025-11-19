"""
Database models for authentication system
"""
from datetime import datetime
from typing import Optional

from app.extensions import db


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
