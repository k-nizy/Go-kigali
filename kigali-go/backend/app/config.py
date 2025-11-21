"""
Application configuration
"""
import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Debug: Print if JWT secret is loaded
if os.getenv('FLASK_ENV') == 'development':
    jwt_secret = os.getenv('JWT_SECRET_KEY', 'NOT_SET')
    print(f"[CONFIG] JWT_SECRET_KEY loaded: {jwt_secret[:20]}..." if jwt_secret != 'NOT_SET' else "[CONFIG] JWT_SECRET_KEY not set!")


class Config:
    """Base configuration"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)
    JWT_TOKEN_LOCATION = ['headers', 'cookies']
    JWT_COOKIE_SECURE = False  # Set True in production with HTTPS
    JWT_COOKIE_CSRF_PROTECT = False  # Enable in production with CSRF tokens
    JWT_COOKIE_SAMESITE = 'Lax'
    JWT_REFRESH_COOKIE_PATH = '/api/auth/refresh'
    
    # Database
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # CORS
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')

    # Cache (can be overridden by env)
    CACHE_TYPE = os.getenv('CACHE_TYPE', 'SimpleCache')
    CACHE_REDIS_URL = os.getenv('CACHE_REDIS_URL', '')
    CACHE_DEFAULT_TIMEOUT = int(os.getenv('CACHE_DEFAULT_TIMEOUT', '5'))
    
    # Email configuration (for development, we'll log tokens)
    MAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.getenv('MAIL_PORT', 587))
    MAIL_USE_TLS = os.getenv('MAIL_USE_TLS', 'true').lower() == 'true'
    MAIL_USERNAME = os.getenv('MAIL_USERNAME', '')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD', '')
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER', 'noreply@kigaligo.com')
    
    # Token expiration
    EMAIL_VERIFICATION_TOKEN_EXPIRES = timedelta(hours=24)
    PASSWORD_RESET_TOKEN_EXPIRES = timedelta(hours=1)
    
    # Bcrypt rounds
    BCRYPT_LOG_ROUNDS = 12


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'sqlite:///kigali_go_dev.db'
    )
    JWT_COOKIE_SECURE = False
    # Connection pool sizing for local dev (adjustable via env)
    _pool_size = int(os.getenv('SQL_POOL_SIZE', '5'))
    _max_overflow = int(os.getenv('SQL_MAX_OVERFLOW', '10'))
    _pool_timeout = int(os.getenv('SQL_POOL_TIMEOUT', '10'))
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
        'pool_size': _pool_size,
        'max_overflow': _max_overflow,
        'pool_timeout': _pool_timeout,
    }


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(seconds=30)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(seconds=60)
    BCRYPT_LOG_ROUNDS = 4  # Faster for tests


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    
    # Get database URL and configure for serverless
    _db_url = os.getenv('DATABASE_URL') or os.getenv('POSTGRES_URL')
    
    # Ensure proper SSL mode for Supabase (only if not already present)
    if _db_url and 'supabase' in _db_url.lower():
        # Check if sslmode is already in the URL
        if 'sslmode' not in _db_url.lower():
            _db_url += '&sslmode=require' if '?' in _db_url else '?sslmode=require'
    
    SQLALCHEMY_DATABASE_URI = _db_url or 'sqlite:///kigali_go.db'
    
    # SQLAlchemy engine options for serverless (Vercel)
    # CRITICAL FIX: Use NullPool for serverless to prevent connection pool exhaustion
    # NullPool creates a new connection for each request and closes it immediately
    _connect_args = {
        'connect_timeout': 30,  # 30 second timeout for slow Supabase connections
        'keepalives': 1,
        'keepalives_idle': 30,
        'keepalives_interval': 10,
        'keepalives_count': 5,
    }
    
    # Only add sslmode to connect_args if not in URL (psycopg2 prefers URL params)
    if _db_url and 'supabase' in _db_url.lower() and 'sslmode' not in _db_url.lower():
        _connect_args['sslmode'] = 'require'
    
    # Check if we should use NullPool (recommended for serverless)
    _use_null_pool = os.getenv('SQLALCHEMY_POOL_CLASS', 'NullPool').lower() == 'nullpool'
    
    if _use_null_pool:
        # NullPool: No connection pooling - creates connection per request
        # This prevents "QueuePool limit reached" errors in serverless environments
        from sqlalchemy.pool import NullPool
        SQLALCHEMY_ENGINE_OPTIONS = {
            'poolclass': NullPool,
            'pool_pre_ping': True,  # Verify connections before using
            'connect_args': _connect_args
        }
    else:
        # Traditional pooling with minimal connections for serverless
        _pool_size = int(os.getenv('SQL_POOL_SIZE', '1'))  # Reduced from 5
        _max_overflow = int(os.getenv('SQL_MAX_OVERFLOW', '0'))  # Reduced from 10
        _pool_timeout = int(os.getenv('SQL_POOL_TIMEOUT', '5'))  # Reduced from 10
        SQLALCHEMY_ENGINE_OPTIONS = {
            'pool_pre_ping': True,  # Verify connections before using
            'pool_recycle': 300,    # Recycle connections after 5 minutes
            'pool_size': _pool_size,
            'max_overflow': _max_overflow,
            'pool_timeout': _pool_timeout,
            'connect_args': _connect_args
        }
    
    JWT_COOKIE_SECURE = True
    JWT_COOKIE_CSRF_PROTECT = True
    
    # Ensure critical configs are set
    @classmethod
    def init_app(cls, app):
        Config.init_app(app)
        
        # Configure SQLAlchemy engine options
        if hasattr(cls, 'SQLALCHEMY_ENGINE_OPTIONS'):
            app.config['SQLALCHEMY_ENGINE_OPTIONS'] = cls.SQLALCHEMY_ENGINE_OPTIONS
        
        # Log to stderr
        import logging
        from logging import StreamHandler
        file_handler = StreamHandler()
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)


config_by_name = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
