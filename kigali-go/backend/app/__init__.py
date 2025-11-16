"""
Flask application factory for KigaliGo Auth System
"""
from flask import Flask
from flask_cors import CORS
from app.extensions import db, migrate, jwt, limiter, ma, bcrypt
from app.config import config_by_name
from utils.error_handlers import register_error_handlers
import os


def create_app(config_name: str = None) -> Flask:
    """
    Application factory pattern
    
    Args:
        config_name: Configuration name (development, testing, production)
    
    Returns:
        Configured Flask application
    """
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    limiter.init_app(app)
    ma.init_app(app)
    bcrypt.init_app(app)
    
    # Configure CORS
    CORS(app, 
         origins=app.config['CORS_ORIGINS'],
         supports_credentials=True,
         allow_headers=['Content-Type', 'Authorization'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    
    # Register JWT callbacks
    from app.models import TokenBlocklist
    
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
        """Check if token has been revoked"""
        jti = jwt_payload["jti"]
        token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()
        return token is not None
    
    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        """Handle revoked token"""
        return {'message': 'Token has been revoked'}, 401
    
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        """Handle expired token"""
        return {'message': 'Token has expired'}, 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        """Handle invalid token"""
        app.logger.error(f'Invalid token error: {error}')
        return {'message': 'Invalid token', 'error': str(error)}, 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        """Handle missing token"""
        return {'message': 'Authorization token is missing'}, 401
    
    # Register blueprints
    from app.resources.auth import auth_bp
    from api.routes import api_bp as legacy_api_bp, init_limiter as init_routes_limiter
    from api.auth import auth_bp as legacy_auth_bp, init_limiter as init_auth_limiter
    from api.admin import admin_bp as legacy_admin_bp

    # Initialize limiters for api routes
    init_routes_limiter(limiter)
    init_auth_limiter(limiter)

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(legacy_api_bp, url_prefix='/api/v1')
    app.register_blueprint(legacy_auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(legacy_admin_bp, url_prefix='/api/v1/admin')
    
    # Initialize database tables if they don't exist (for serverless)
    try:
        with app.app_context():
            # Only create tables if using SQLite (development)
            if 'sqlite' in app.config.get('SQLALCHEMY_DATABASE_URI', ''):
                db.create_all()
    except Exception as e:
        app.logger.warning(f'Could not initialize database tables: {e}')

    # Register legacy error handlers
    register_error_handlers(app)
    
    # Health check endpoint
    @app.route('/health')
    @app.route('/api/health')
    def health():
        return {'status': 'healthy', 'service': 'kigali-go-auth'}, 200
    
    # Debug endpoint to test JWT
    @app.route('/debug/jwt')
    def debug_jwt():
        from flask import request
        auth_header = request.headers.get('Authorization', 'No Authorization header')
        return {
            'authorization_header': auth_header,
            'jwt_locations': app.config.get('JWT_TOKEN_LOCATION'),
            'jwt_secret_set': bool(app.config.get('JWT_SECRET_KEY'))
        }, 200
    
    return app
