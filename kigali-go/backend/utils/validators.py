"""
Input validation utilities for the KigaliGo API
"""
import re
from datetime import datetime
from flask import request, jsonify
from werkzeug.exceptions import BadRequest

class Validator:
    """Base validator class with common validation methods"""
    
    @staticmethod
    def validate_required(data, fields):
        """Check if required fields are present"""
        missing = [field for field in fields if field not in data or data[field] is None]
        if missing:
            raise BadRequest(f"Missing required fields: {', '.join(missing)}")
        return True
    
    @staticmethod
    def validate_email(email):
        """Validate email format"""
        if not email:
            return True
        if not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', email):
            raise BadRequest("Invalid email format")
        return True
    
    @staticmethod
    def validate_phone(phone):
        """Validate phone number format (Rwanda format)"
        if not phone:
            return True
        # Rwanda phone number format: +2507[2-9][0-9]{7} or 07[2-9][0-9]{7}
        if not re.match(r'^(\+?250|0)?7[2-9][0-9]{7}$', phone):
            raise BadRequest("Invalid phone number format. Use format: 07XXXXXXXX or +2507XXXXXXXX")
        return True
    
    @staticmethod
    def validate_password(password):
        """Validate password strength"""
        if len(password) < 8:
            raise BadRequest("Password must be at least 8 characters long")
        if not any(c.isupper() for c in password):
            raise BadRequest("Password must contain at least one uppercase letter")
        if not any(c.isdigit() for c in password):
            raise BadRequest("Password must contain at least one number")
        return True
    
    @staticmethod
    def validate_coordinates(lat, lng):
        """Validate geographic coordinates"""
        try:
            lat = float(lat)
            lng = float(lng)
            if not (-90 <= lat <= 90 and -180 <= lng <= 180):
                raise ValueError
            return True
        except (ValueError, TypeError):
            raise BadRequest("Invalid coordinates provided")


# Decorator for request validation
def validate_request(schema):
    """
    Decorator to validate request data against a schema
    
    Example schema:
    {
        'field_name': {
            'type': str/int/float/bool/list/dict,
            'required': True/False,
            'validator': callable  # optional custom validator function
        }
    }
    """
    def decorator(f):
        def wrapper(*args, **kwargs):
            data = request.get_json() or {}
            errors = []
            
            # Check for required fields
            required_fields = [k for k, v in schema.items() if v.get('required', False)]
            for field in required_fields:
                if field not in data or data[field] is None:
                    errors.append(f"{field} is required")
            
            # Validate field types and custom validators
            for field, config in schema.items():
                if field in data and data[field] is not None:
                    # Check type
                    expected_type = config.get('type')
                    if expected_type and not isinstance(data[field], expected_type):
                        errors.append(f"{field} must be of type {expected_type.__name__}")
                    
                    # Run custom validator if provided
                    validator = config.get('validator')
                    if validator and callable(validator):
                        try:
                            validator(data[field])
                        except ValueError as e:
                            errors.append(str(e))
            
            if errors:
                return jsonify({
                    'status': 'error',
                    'message': 'Validation failed',
                    'errors': errors
                }), 400
                
            return f(*args, **kwargs)
        
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator
