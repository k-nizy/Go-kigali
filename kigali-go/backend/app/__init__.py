"""
Flask application factory for KigaliGo Auth System
"""
from flask import Flask, jsonify
from flask_cors import CORS
from app.extensions import db, migrate, jwt, limiter, ma, bcrypt, cache
from app.config import config_by_name
from utils.error_handlers import register_error_handlers
import os
import traceback


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
    
    # Configure engine for serverless after initialization using event listeners
    # Flask-SQLAlchemy doesn't allow direct engine assignment, so we use events
    if 'postgresql' in app.config.get('SQLALCHEMY_DATABASE_URI', '').lower():
        from sqlalchemy import event
        from sqlalchemy.pool import Pool
        
        # Get engine options from config
        engine_options = app.config.get('SQLALCHEMY_ENGINE_OPTIONS', {})
        
        # Configure pool settings via event listeners
        @event.listens_for(Pool, "connect")
        def set_postgres_params(dbapi_conn, connection_record):
            """Set connection parameters for PostgreSQL"""
            try:
                # Set timezone and application name
                with dbapi_conn.cursor() as cursor:
                    cursor.execute("SET timezone = 'UTC'")
                    cursor.execute("SET application_name = 'kigali-go-api'")
            except Exception as e:
                app.logger.warning(f'Could not set PostgreSQL connection parameters: {e}')
        
        # Note: Pool configuration (pool_size, pool_recycle, etc.) should be set
        # via SQLALCHEMY_ENGINE_OPTIONS in config, which Flask-SQLAlchemy 3.x supports
        # For older versions, these are handled automatically by the connection string
    migrate.init_app(app, db)
    jwt.init_app(app)
    limiter.init_app(app)
    ma.init_app(app)
    bcrypt.init_app(app)
    cache.init_app(app)
    
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
    from api.map_routes import map_bp
    from api.realtime_routes import realtime_bp
    from api.trip_planning_routes import trip_planning_bp
    from api.saved_locations_routes import saved_locations_bp
    from api.vehicle_simulation import simulation_bp

    # Initialize limiters for api routes
    init_routes_limiter(limiter)
    init_auth_limiter(limiter)

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(legacy_api_bp, url_prefix='/api/v1')
    app.register_blueprint(legacy_auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(legacy_admin_bp, url_prefix='/api/v1/admin')
    app.register_blueprint(map_bp, url_prefix='/api/v1/map')
    app.register_blueprint(realtime_bp, url_prefix='/api/v1/realtime')
    app.register_blueprint(trip_planning_bp, url_prefix='/api/v1/trip-planning')
    app.register_blueprint(saved_locations_bp, url_prefix='/api/v1/saved-locations')
    app.register_blueprint(simulation_bp, url_prefix='/api/v1/simulation')
    
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
    
    # Database diagnostic endpoint
    @app.route('/api/debug/db')
    def debug_db():
        """Debug endpoint to check database connection and tables"""
        try:
            from sqlalchemy import text, inspect
            
            diagnostics = {
                'database_uri_set': bool(app.config.get('SQLALCHEMY_DATABASE_URI')),
                'database_uri_preview': app.config.get('SQLALCHEMY_DATABASE_URI', 'NOT SET')[:80] + '...' if app.config.get('SQLALCHEMY_DATABASE_URI') else 'NOT SET',
                'connection_test': False,
                'users_table_exists': False,
                'all_tables': [],
                'users_table_columns': [],
                'error': None,
                'errors': []
            }
            
            # Test connection
            try:
                db.session.execute(text('SELECT 1'))
                db.session.commit()
                diagnostics['connection_test'] = True
            except Exception as conn_error:
                diagnostics['error'] = str(conn_error)
                diagnostics['errors'].append(f'Connection error: {str(conn_error)}')
                db.session.rollback()
            
            # Check if users table exists and get columns
            if diagnostics['connection_test']:
                try:
                    inspector = inspect(db.engine)
                    tables = inspector.get_table_names()
                    diagnostics['all_tables'] = sorted(tables)
                    diagnostics['users_table_exists'] = 'users' in tables
                    
                    if 'users' in tables:
                        try:
                            columns = inspector.get_columns('users')
                            diagnostics['users_table_columns'] = [
                                {
                                    'name': col['name'],
                                    'type': str(col['type']),
                                    'nullable': col['nullable']
                                }
                                for col in columns
                            ]
                        except Exception as col_error:
                            diagnostics['errors'].append(f'Column inspection error: {str(col_error)}')
                        
                        # Try to query users table
                        try:
                            from models import User
                            user_count = User.query.count()
                            diagnostics['user_count'] = user_count
                        except Exception as query_error:
                            diagnostics['query_error'] = str(query_error)
                            diagnostics['errors'].append(f'Query error: {str(query_error)}')
                except Exception as inspect_error:
                    diagnostics['inspect_error'] = str(inspect_error)
                    diagnostics['errors'].append(f'Inspection error: {str(inspect_error)}')
            
            return jsonify(diagnostics), 200
            
        except Exception as e:
            import traceback
            return jsonify({
                'error': str(e),
                'error_type': type(e).__name__,
                'traceback': traceback.format_exc()
            }), 500
    
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
