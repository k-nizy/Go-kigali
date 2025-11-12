"""
Marshmallow schemas for request/response validation
"""
from marshmallow import Schema, fields, validate, validates, ValidationError, post_load
import re


class RegisterSchema(Schema):
    """Schema for user registration"""
    email = fields.Email(required=True, validate=validate.Length(max=255))
    password = fields.Str(required=True, validate=validate.Length(min=12, max=128))
    name = fields.Str(required=False, validate=validate.Length(max=150))
    
    @validates('password')
    def validate_password(self, value, **kwargs):
        """Validate password strength"""
        if not re.search(r'[A-Z]', value):
            raise ValidationError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', value):
            raise ValidationError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', value):
            raise ValidationError('Password must contain at least one number')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise ValidationError('Password must contain at least one special character')
    
    @post_load
    def lowercase_email(self, data, **kwargs):
        """Convert email to lowercase"""
        data['email'] = data['email'].lower()
        return data


class LoginSchema(Schema):
    """Schema for user login"""
    email = fields.Email(required=True)
    password = fields.Str(required=True)
    remember = fields.Bool(load_default=False)
    
    @post_load
    def lowercase_email(self, data, **kwargs):
        """Convert email to lowercase"""
        data['email'] = data['email'].lower()
        return data


class ForgotPasswordSchema(Schema):
    """Schema for forgot password request"""
    email = fields.Email(required=True)
    
    @post_load
    def lowercase_email(self, data, **kwargs):
        """Convert email to lowercase"""
        data['email'] = data['email'].lower()
        return data


class ResetPasswordSchema(Schema):
    """Schema for password reset"""
    token = fields.Str(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=12, max=128))
    
    @validates('password')
    def validate_password(self, value, **kwargs):
        """Validate password strength"""
        if not re.search(r'[A-Z]', value):
            raise ValidationError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', value):
            raise ValidationError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', value):
            raise ValidationError('Password must contain at least one number')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise ValidationError('Password must contain at least one special character')


class UserSchema(Schema):
    """Schema for user response"""
    id = fields.Int(dump_only=True)
    email = fields.Email(dump_only=True)
    name = fields.Str(dump_only=True)
    is_email_verified = fields.Bool(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    last_login = fields.DateTime(dump_only=True)
