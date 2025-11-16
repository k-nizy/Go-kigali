"""
Authentication routes for KigaliGo application
"""

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User
from datetime import timedelta
import re
import traceback

# Use a unique blueprint name to avoid conflicts with the main auth blueprint
auth_bp = Blueprint('legacy_auth', __name__, url_prefix=None)

# Rate limiter will be initialized by the app factory
limiter = None

def init_limiter(app_limiter):
    """Initialize limiter from app"""
    global limiter
    limiter = app_limiter

def rate_limit_decorator(limit_str):
    """Create a rate limit decorator that works with or without limiter"""
    def decorator(func):
        if limiter:
            return limiter.limit(limit_str)(func)
        return func
    return decorator

@auth_bp.route('/register', methods=['POST'])
@rate_limit_decorator("5 per minute")
def register():
    """Register a new user"""
    try:
        data = request.get_json() or {}
        
        # Validate required fields
        if 'name' not in data:
            return jsonify({'code': 400, 'message': 'Name is required'}), 400
        
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower() if data.get('email') else None
        phone = data.get('phone', '').strip() if data.get('phone') else None
        password = data.get('password', '').strip()
        preferred_language = data.get('preferred_language', 'en')
        
        # Validate inputs
        if len(name) < 2:
            return jsonify({'code': 400, 'message': 'Name must be at least 2 characters'}), 400
        
        if email and not is_valid_email(email):
            return jsonify({'code': 400, 'message': 'Invalid email format'}), 400
        
        if phone and not is_valid_phone(phone):
            return jsonify({'code': 400, 'message': 'Invalid phone number format'}), 400
        
        if preferred_language not in ['en', 'rw']:
            return jsonify({'code': 400, 'message': 'Language must be en or rw'}), 400
        
        # Check database connection
        try:
            from sqlalchemy import text
            db.session.execute(text('SELECT 1'))
            db.session.commit()
        except Exception as db_error:
            current_app.logger.error(f'Database connection error: {db_error}')
            db.session.rollback()
            return jsonify({'code': 500, 'message': 'Database connection error. Please try again later.'}), 500
        
        # Check if user already exists
        if email:
            existing_user = User.query.filter_by(email=email).first()
            if existing_user:
                return jsonify({'code': 409, 'message': 'Email already registered'}), 409
        
        if phone:
            existing_user = User.query.filter_by(phone=phone).first()
            if existing_user:
                return jsonify({'code': 409, 'message': 'Phone number already registered'}), 409
        
        # Create new user
        user = User(
            name=name,
            email=email,
            phone=phone,
            preferred_language=preferred_language
        )
        
        # Set password if provided
        if password:
            if len(password) < 6:
                return jsonify({'code': 400, 'message': 'Password must be at least 6 characters'}), 400
            user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        # Generate access token
        access_token = create_access_token(
            identity=user.id,
            expires_delta=timedelta(hours=24)
        )
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict(),
            'access_token': access_token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Registration error: {str(e)}\n{traceback.format_exc()}')
        return jsonify({'code': 500, 'message': 'An unexpected error occurred'}), 500

@auth_bp.route('/login', methods=['POST'])
@rate_limit_decorator("10 per minute")
def login():
    """Login user with email/phone and password"""
    try:
        data = request.get_json() or {}
        
        identifier = data.get('identifier', '').strip()  # email or phone
        password = data.get('password', '').strip()
        
        if not identifier or not password:
            return jsonify({'code': 400, 'message': 'Identifier and password are required'}), 400
        
        # Check database connection
        try:
            from sqlalchemy import text
            db.session.execute(text('SELECT 1'))
            db.session.commit()
        except Exception as db_error:
            current_app.logger.error(f'Database connection error: {db_error}')
            db.session.rollback()
            return jsonify({'code': 500, 'message': 'Database connection error. Please try again later.'}), 500
        
        # Find user by email or phone - use db.session.query for correct instance
        user = None
        if '@' in identifier:
            user = db.session.query(User).filter_by(email=identifier.lower()).first()
        else:
            user = db.session.query(User).filter_by(phone=identifier).first()
        
        if not user or not user.check_password(password):
            return jsonify({'code': 401, 'message': 'Invalid credentials'}), 401
        
        if not user.is_active:
            return jsonify({'code': 403, 'message': 'Account is deactivated'}), 403
        
        # Generate access token
        access_token = create_access_token(
            identity=user.id,
            expires_delta=timedelta(hours=24)
        )
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict(),
            'access_token': access_token
        }), 200
        
    except Exception as e:
        current_app.logger.error(f'Login error: {str(e)}\n{traceback.format_exc()}')
        return jsonify({'code': 500, 'message': 'An unexpected error occurred'}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        current_app.logger.error(f'Get profile error: {str(e)}\n{traceback.format_exc()}')
        return jsonify({'code': 500, 'message': 'An unexpected error occurred'}), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update current user profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        if 'name' in data:
            name = data['name'].strip()
            if len(name) >= 2:
                user.name = name
            else:
                return jsonify({'error': 'Name must be at least 2 characters'}), 400
        
        if 'email' in data and data['email']:
            email = data['email'].strip().lower()
            if is_valid_email(email):
                # Check if email is already taken by another user
                existing_user = User.query.filter_by(email=email).first()
                if existing_user and existing_user.id != user.id:
                    return jsonify({'error': 'Email already taken'}), 409
                user.email = email
            else:
                return jsonify({'error': 'Invalid email format'}), 400
        
        if 'phone' in data and data['phone']:
            phone = data['phone'].strip()
            if is_valid_phone(phone):
                # Check if phone is already taken by another user
                existing_user = User.query.filter_by(phone=phone).first()
                if existing_user and existing_user.id != user.id:
                    return jsonify({'error': 'Phone number already taken'}), 409
                user.phone = phone
            else:
                return jsonify({'error': 'Invalid phone number format'}), 400
        
        if 'preferred_language' in data:
            language = data['preferred_language']
            if language in ['en', 'rw']:
                user.preferred_language = language
            else:
                return jsonify({'error': 'Language must be en or rw'}), 400
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Update profile error: {str(e)}\n{traceback.format_exc()}')
        return jsonify({'code': 500, 'message': 'An unexpected error occurred'}), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        current_password = data.get('current_password', '').strip()
        new_password = data.get('new_password', '').strip()
        
        if not current_password or not new_password:
            return jsonify({'error': 'Current and new passwords are required'}), 400
        
        if len(new_password) < 6:
            return jsonify({'error': 'New password must be at least 6 characters'}), 400
        
        if not user.check_password(current_password):
            return jsonify({'error': 'Current password is incorrect'}), 401
        
        user.set_password(new_password)
        db.session.commit()
        
        return jsonify({
            'message': 'Password changed successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Change password error: {str(e)}\n{traceback.format_exc()}')
        return jsonify({'code': 500, 'message': 'An unexpected error occurred'}), 500

def is_valid_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def is_valid_phone(phone):
    """Validate phone number format (Rwanda format)"""
    # Remove all non-digit characters
    digits = re.sub(r'\D', '', phone)
    
    # Check if it's a valid Rwanda phone number
    # Rwanda numbers start with +250 or 250, followed by 9 digits
    if digits.startswith('250'):
        digits = digits[3:]  # Remove country code
    elif digits.startswith('0'):
        digits = digits[1:]  # Remove leading zero
    
    return len(digits) == 9 and digits.isdigit()
