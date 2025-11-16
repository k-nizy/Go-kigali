"""
Authentication endpoints
"""
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required,
    get_jwt_identity, get_jwt, set_refresh_cookies, unset_jwt_cookies
)
from marshmallow import ValidationError
from datetime import datetime, timedelta
import secrets
import uuid
import traceback

from app.extensions import db, limiter
from models import User
from app.models import TokenBlocklist, PasswordResetToken, EmailVerificationToken
from app.schemas import (
    RegisterSchema, LoginSchema, ForgotPasswordSchema,
    ResetPasswordSchema, UserSchema
)
from app.utils.email import send_verification_email, send_password_reset_email

auth_bp = Blueprint('auth', __name__)

# Initialize schemas
register_schema = RegisterSchema()
login_schema = LoginSchema()
forgot_password_schema = ForgotPasswordSchema()
reset_password_schema = ResetPasswordSchema()
user_schema = UserSchema()


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user
    
    POST /api/auth/register
    Body: { "email": "user@example.com", "password": "P@ssw0rd!", "name": "Kevin" }
    Success: 201 { "message": "verification email sent" }
    Errors: 400 validation, 409 duplicate email
    
    Example cURL:
    curl -X POST http://localhost:5000/api/auth/register \
      -H "Content-Type: application/json" \
      -d '{"email":"user@example.com","password":"P@ssw0rd!123","name":"Kevin"}'
    """
    try:
        request_data = request.get_json() or {}
        
        # Validate input
        try:
            data = register_schema.load(request_data)
        except ValidationError as err:
            return jsonify({'code': 400, 'message': 'Validation error', 'errors': err.messages}), 400
        except Exception as e:
            current_app.logger.error(f'Schema validation error: {e}')
            return jsonify({'code': 400, 'message': 'Invalid request data'}), 400
        
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
        if User.find_by_email(data['email']):
            return jsonify({'code': 409, 'message': 'Email already registered'}), 409
        
        # Create new user
        user = User(
            email=data['email'],
            name=data.get('name', ''),
            is_active=True,
            is_email_verified=False,
            uuid=str(uuid.uuid4())
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Generate verification token (if EmailVerificationToken model exists)
        try:
            verification_token = secrets.token_urlsafe(32)
            email_token = EmailVerificationToken(
                user_id=user.id,
                token=verification_token
            )
            db.session.add(email_token)
            db.session.commit()
            
            # Send verification email (in dev, return token)
            if current_app.config.get('DEBUG', False):
                current_app.logger.info(f'Verification token for {user.email}: {verification_token}')
                return jsonify({
                    'message': 'Verification email sent',
                    'dev_token': verification_token  # Only in development
                }), 201
            else:
                try:
                    send_verification_email(user.email, verification_token)
                except Exception as email_error:
                    current_app.logger.warning(f'Could not send verification email: {email_error}')
                return jsonify({'message': 'Verification email sent'}), 201
        except NameError:
            # EmailVerificationToken model not available, skip email verification
            current_app.logger.warning('EmailVerificationToken model not available, skipping email verification')
            return jsonify({
                'message': 'Account created successfully',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'name': user.name
                }
            }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Registration error: {str(e)}\n{traceback.format_exc()}')
        return jsonify({'code': 500, 'message': 'An unexpected error occurred'}), 500


@auth_bp.route('/verify-email', methods=['GET', 'POST'])
def verify_email():
    """
    Verify user email with token
    
    GET /api/auth/verify-email?token=<token>
    Success: 200 { "message": "Email verified successfully" }
    Errors: 400 invalid/expired token
    
    Example cURL:
    curl -X GET "http://localhost:5000/api/auth/verify-email?token=TOKEN_HERE"
    """
    token = request.args.get('token') if request.method == 'GET' else request.get_json().get('token')
    
    if not token:
        return jsonify({'message': 'Token is required'}), 400
    
    # Find valid token
    email_token = EmailVerificationToken.find_valid_token(token)
    
    if not email_token:
        return jsonify({'message': 'Invalid or expired verification token'}), 400
    
    # Mark email as verified
    user = email_token.user
    user.is_email_verified = True
    email_token.verified_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({'message': 'Email verified successfully'}), 200


@auth_bp.route('/login', methods=['POST'])
@limiter.limit("5 per minute")
def login():
    """
    Login user and issue tokens
    
    POST /api/auth/login
    Body: { "email": "user@example.com", "password": "P@ssw0rd!", "remember": true }
    Success: 200 { "access_token": "<jwt>", "user": {...} }
    Also sets refresh_token as HTTP-only cookie
    
    Example cURL:
    curl -X POST http://localhost:5000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"user@example.com","password":"P@ssw0rd!123","remember":true}' \
      -c cookies.txt
    """
    try:
        # Validate input
        data = login_schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    
    # Find user
    user = User.find_by_email(data['email'])
    
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    if not user.is_active:
        return jsonify({'message': 'Account is deactivated'}), 403
    
    if not user.is_email_verified:
        return jsonify({'message': 'Please verify your email before logging in'}), 403
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.session.commit()
    
    # Create tokens (identity must be string)
    access_token = create_access_token(identity=str(user.id))
    
    # Adjust refresh token expiry based on remember me
    if data.get('remember'):
        refresh_expires = timedelta(days=30)
    else:
        refresh_expires = current_app.config['JWT_REFRESH_TOKEN_EXPIRES']
    
    refresh_token = create_refresh_token(identity=str(user.id), expires_delta=refresh_expires)
    
    # Prepare response
    response = jsonify({
        'access_token': access_token,
        'user': user.to_dict()
    })
    
    # Set refresh token as HTTP-only cookie
    set_refresh_cookies(response, refresh_token)
    
    return response, 200


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """
    Refresh access token using refresh token
    
    POST /api/auth/refresh
    Uses refresh token cookie
    Success: 200 { "access_token": "<jwt>" } and rotates refresh cookie
    
    Example cURL:
    curl -X POST http://localhost:5000/api/auth/refresh \
      -b cookies.txt \
      -c cookies.txt
    """
    # Get current user identity (as string)
    current_user_id = get_jwt_identity()
    
    # Get current refresh token JTI for rotation
    jti = get_jwt()["jti"]
    
    # Revoke old refresh token (convert to int for DB)
    TokenBlocklist.add_to_blocklist(jti, 'refresh', int(current_user_id))
    
    # Create new tokens (identity must be string)
    access_token = create_access_token(identity=current_user_id)
    refresh_token = create_refresh_token(identity=current_user_id)
    
    # Prepare response
    response = jsonify({'access_token': access_token})
    
    # Set new refresh token cookie (rotation)
    set_refresh_cookies(response, refresh_token)
    
    return response, 200


@auth_bp.route('/logout', methods=['POST'])
@jwt_required(verify_type=False)
def logout():
    """
    Logout user and revoke tokens
    
    POST /api/auth/logout
    Clears refresh cookie and revokes tokens
    Success: 200 { "message": "Logged out successfully" }
    
    Example cURL:
    curl -X POST http://localhost:5000/api/auth/logout \
      -H "Authorization: Bearer ACCESS_TOKEN" \
      -b cookies.txt
    """
    token = get_jwt()
    jti = token["jti"]
    token_type = token["type"]
    user_id = get_jwt_identity()
    
    # Add token to blocklist (convert to int for DB)
    TokenBlocklist.add_to_blocklist(jti, token_type, int(user_id))
    
    # Prepare response
    response = jsonify({'message': 'Logged out successfully'})
    
    # Clear refresh token cookie
    unset_jwt_cookies(response)
    
    return response, 200


@auth_bp.route('/forgot-password', methods=['POST'])
@limiter.limit("3 per hour")
def forgot_password():
    """
    Request password reset
    
    POST /api/auth/forgot-password
    Body: { "email": "user@example.com" }
    Success: 200 { "message": "Reset email sent" }
    
    Example cURL:
    curl -X POST http://localhost:5000/api/auth/forgot-password \
      -H "Content-Type: application/json" \
      -d '{"email":"user@example.com"}'
    """
    try:
        # Validate input
        data = forgot_password_schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    
    # Find user (always return success to prevent email enumeration)
    user = User.find_by_email(data['email'])
    
    if user and user.is_active:
        # Generate reset token
        reset_token = secrets.token_urlsafe(32)
        password_reset = PasswordResetToken(
            user_id=user.id,
            token=reset_token
        )
        db.session.add(password_reset)
        db.session.commit()
        
        # Send reset email (in dev, return token)
        if current_app.config['DEBUG']:
            current_app.logger.info(f'Password reset token for {user.email}: {reset_token}')
            return jsonify({
                'message': 'Reset email sent',
                'dev_token': reset_token  # Only in development
            }), 200
        else:
            send_password_reset_email(user.email, reset_token)
    
    # Always return success
    return jsonify({'message': 'If the email exists, a reset link has been sent'}), 200


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """
    Reset password with token
    
    POST /api/auth/reset-password
    Body: { "token": "...", "password": "NewP@ss1" }
    Success: 200 { "message": "Password changed successfully" }
    
    Example cURL:
    curl -X POST http://localhost:5000/api/auth/reset-password \
      -H "Content-Type: application/json" \
      -d '{"token":"TOKEN_HERE","password":"NewP@ssw0rd!123"}'
    """
    try:
        # Validate input
        data = reset_password_schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    
    # Find valid token
    reset_token = PasswordResetToken.find_valid_token(data['token'])
    
    if not reset_token:
        return jsonify({'message': 'Invalid or expired reset token'}), 400
    
    # Update password
    user = reset_token.user
    user.set_password(data['password'])
    reset_token.used_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({'message': 'Password changed successfully'}), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """
    Get current user profile
    
    GET /api/auth/me
    Requires: Authorization header with access token
    Success: 200 { "user": {...} }
    
    Example cURL:
    curl -X GET http://localhost:5000/api/auth/me \
      -H "Authorization: Bearer ACCESS_TOKEN"
    """
    try:
        current_user_id = get_jwt_identity()
        current_app.logger.info(f'JWT identity: {current_user_id}')
        # Convert string ID to int for database query
        user = User.query.get(int(current_user_id))
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
    except Exception as e:
        current_app.logger.error(f'Error in get_current_user: {str(e)}')
        return jsonify({'message': 'Error processing request', 'error': str(e)}), 500
