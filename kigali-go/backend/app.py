"""
KigaliGo Backend Application
Flask REST API for transportation analytics and trip planning
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from werkzeug.exceptions import HTTPException
import logging
import os
import sys

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models import db
from api.routes import api_bp
from api.auth import auth_bp
from api.admin import admin_bp
from utils.error_handlers import register_error_handlers, APIError, ValidationError, \
    AuthenticationError, AuthorizationError, ResourceNotFoundError, InternalServerError

def validate_environment():
    """Validate required environment variables"""
    required_vars = ['SECRET_KEY', 'DATABASE_URL']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")
    
    # Validate SECRET_KEY strength
    secret_key = os.getenv('SECRET_KEY')
    if len(secret_key) < 32:
        raise ValueError("SECRET_KEY must be at least 32 characters long for security")
    
    # Validate DATABASE_URL format
    database_url = os.getenv('DATABASE_URL')
    if not database_url.startswith(('postgresql://', 'sqlite:///')):
        raise ValueError("DATABASE_URL must be a valid PostgreSQL or SQLite connection string")

def create_app():
    """Application factory pattern"""
    # Validate environment variables first
    validate_environment()
    
    app = Flask(__name__)
    
    # Load configuration from environment variables
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 
        'postgresql://username:password@localhost:5432/kigali_go_db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['MAX_CONTENT_LENGTH'] = int(os.getenv('MAX_CONTENT_LENGTH', 16777216))
    app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', 'uploads')
    
    # Initialize extensions
    db.init_app(app)
    migrate = Migrate(app, db)
    CORS(app, origins=os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(','))
    
    # Rate limiting
    limiter = Limiter(
        app,
        key_func=get_remote_address,
        default_limits=["1000 per hour"]
    )
    
    # Register blueprints
    app.register_blueprint(api_bp, url_prefix='/api/v1')
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(admin_bp, url_prefix='/api/v1/admin')
    
    # Register error handlers
    register_error_handlers(app)
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'kigali-go-api',
            'version': '1.0.0'
        })
    
    # API documentation endpoint
    @app.route('/api/docs')
    def api_docs():
        return jsonify({
            'title': 'KigaliGo API Documentation',
            'version': '1.0.0',
            'endpoints': {
                'auth': '/api/v1/auth',
                'trips': '/api/v1/routes',
                'vehicles': '/api/v1/vehicles',
                'zones': '/api/v1/zones',
                'fares': '/api/v1/fare',
                'reports': '/api/v1/reports',
                'admin': '/api/v1/admin'
            },
            'documentation': 'https://github.com/your-org/kigali-go/wiki/API-Documentation'
        })
    
    # Configure logging
    if not app.debug:
        logging.basicConfig(level=logging.INFO)
        app.logger.setLevel(logging.INFO)
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    # Create tables if they don't exist
    with app.app_context():
        db.create_all()
    
    app.run(debug=True, host='0.0.0.0', port=5000)
