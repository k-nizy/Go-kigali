"""
Pytest configuration and fixtures
"""
import pytest
from app import create_app
from app.extensions import db as _db
from app.models import User


@pytest.fixture(scope='session')
def app():
    """Create application for testing"""
    app = create_app('testing')
    
    with app.app_context():
        _db.create_all()
        yield app
        _db.drop_all()


@pytest.fixture(scope='function')
def db(app):
    """Create clean database for each test"""
    with app.app_context():
        _db.session.begin_nested()
        yield _db
        _db.session.rollback()
        _db.session.remove()


@pytest.fixture(scope='function')
def client(app, db):
    """Create test client"""
    return app.test_client()


@pytest.fixture
def verified_user(db):
    """Create a verified user for testing"""
    user = User(
        email='test@example.com',
        name='Test User',
        is_email_verified=True,
        is_active=True
    )
    user.set_password('TestP@ssw0rd!123')
    db.session.add(user)
    db.session.commit()
    return user


@pytest.fixture
def unverified_user(db):
    """Create an unverified user for testing"""
    user = User(
        email='unverified@example.com',
        name='Unverified User',
        is_email_verified=False,
        is_active=True
    )
    user.set_password('TestP@ssw0rd!123')
    db.session.add(user)
    db.session.commit()
    return user


@pytest.fixture
def auth_headers(client, verified_user):
    """Get authentication headers with access token"""
    response = client.post('/api/auth/login', json={
        'email': verified_user.email,
        'password': 'TestP@ssw0rd!123'
    })
    access_token = response.json['access_token']
    return {'Authorization': f'Bearer {access_token}'}
