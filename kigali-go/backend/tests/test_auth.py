"""
Authentication endpoint tests
"""
import pytest
from app.models import User, EmailVerificationToken, PasswordResetToken


class TestRegister:
    """Test user registration"""
    
    def test_register_success(self, client, db):
        """Test successful user registration"""
        response = client.post('/api/auth/register', json={
            'email': 'newuser@example.com',
            'password': 'ValidP@ssw0rd!123',
            'name': 'New User'
        })
        
        assert response.status_code == 201
        assert 'message' in response.json
        assert 'dev_token' in response.json  # Development mode
        
        # Verify user was created
        user = User.find_by_email('newuser@example.com')
        assert user is not None
        assert user.name == 'New User'
        assert user.is_email_verified is False
        assert user.check_password('ValidP@ssw0rd!123')
    
    def test_register_duplicate_email(self, client, verified_user):
        """Test registration with duplicate email"""
        response = client.post('/api/auth/register', json={
            'email': verified_user.email,
            'password': 'ValidP@ssw0rd!123',
            'name': 'Duplicate'
        })
        
        assert response.status_code == 409
        assert 'already registered' in response.json['message'].lower()
    
    def test_register_invalid_email(self, client):
        """Test registration with invalid email"""
        response = client.post('/api/auth/register', json={
            'email': 'invalid-email',
            'password': 'ValidP@ssw0rd!123'
        })
        
        assert response.status_code == 400
        assert 'errors' in response.json
    
    def test_register_weak_password(self, client):
        """Test registration with weak password"""
        response = client.post('/api/auth/register', json={
            'email': 'test@example.com',
            'password': 'weak'
        })
        
        assert response.status_code == 400
        assert 'errors' in response.json
    
    def test_register_password_requirements(self, client):
        """Test password validation requirements"""
        # Missing uppercase
        response = client.post('/api/auth/register', json={
            'email': 'test1@example.com',
            'password': 'validp@ssw0rd!123'
        })
        assert response.status_code == 400
        
        # Missing lowercase
        response = client.post('/api/auth/register', json={
            'email': 'test2@example.com',
            'password': 'VALIDP@SSW0RD!123'
        })
        assert response.status_code == 400
        
        # Missing number
        response = client.post('/api/auth/register', json={
            'email': 'test3@example.com',
            'password': 'ValidP@ssword!'
        })
        assert response.status_code == 400
        
        # Missing special character
        response = client.post('/api/auth/register', json={
            'email': 'test4@example.com',
            'password': 'ValidPassword123'
        })
        assert response.status_code == 400


class TestEmailVerification:
    """Test email verification"""
    
    def test_verify_email_success(self, client, db, unverified_user):
        """Test successful email verification"""
        # Create verification token
        token = EmailVerificationToken(
            user_id=unverified_user.id,
            token='test-token-123'
        )
        db.session.add(token)
        db.session.commit()
        
        response = client.get(f'/api/auth/verify-email?token=test-token-123')
        
        assert response.status_code == 200
        assert 'verified successfully' in response.json['message'].lower()
        
        # Verify user is now verified
        db.session.refresh(unverified_user)
        assert unverified_user.is_email_verified is True
    
    def test_verify_email_invalid_token(self, client):
        """Test verification with invalid token"""
        response = client.get('/api/auth/verify-email?token=invalid-token')
        
        assert response.status_code == 400
        assert 'invalid' in response.json['message'].lower()


class TestLogin:
    """Test user login"""
    
    def test_login_success(self, client, verified_user):
        """Test successful login"""
        response = client.post('/api/auth/login', json={
            'email': verified_user.email,
            'password': 'TestP@ssw0rd!123'
        })
        
        assert response.status_code == 200
        assert 'access_token' in response.json
        assert 'user' in response.json
        assert response.json['user']['email'] == verified_user.email
        
        # Check that refresh token cookie is set
        cookies = response.headers.getlist('Set-Cookie')
        assert any('refresh_token_cookie' in cookie for cookie in cookies)
    
    def test_login_invalid_credentials(self, client, verified_user):
        """Test login with invalid password"""
        response = client.post('/api/auth/login', json={
            'email': verified_user.email,
            'password': 'WrongPassword123!'
        })
        
        assert response.status_code == 401
        assert 'invalid' in response.json['message'].lower()
    
    def test_login_nonexistent_user(self, client):
        """Test login with non-existent email"""
        response = client.post('/api/auth/login', json={
            'email': 'nonexistent@example.com',
            'password': 'TestP@ssw0rd!123'
        })
        
        assert response.status_code == 401
    
    def test_login_unverified_email(self, client, unverified_user):
        """Test login with unverified email"""
        response = client.post('/api/auth/login', json={
            'email': unverified_user.email,
            'password': 'TestP@ssw0rd!123'
        })
        
        assert response.status_code == 403
        assert 'verify' in response.json['message'].lower()
    
    def test_login_rate_limit(self, client, verified_user):
        """Test rate limiting on login endpoint"""
        # Make 6 requests (limit is 5 per minute)
        for i in range(6):
            response = client.post('/api/auth/login', json={
                'email': verified_user.email,
                'password': 'WrongPassword!'
            })
            
            if i < 5:
                assert response.status_code in [401, 403]
            else:
                # 6th request should be rate limited
                assert response.status_code == 429


class TestRefresh:
    """Test token refresh"""
    
    def test_refresh_success(self, client, verified_user):
        """Test successful token refresh"""
        # Login first
        login_response = client.post('/api/auth/login', json={
            'email': verified_user.email,
            'password': 'TestP@ssw0rd!123'
        })
        
        # Extract cookies
        cookies = {}
        for cookie in login_response.headers.getlist('Set-Cookie'):
            if 'refresh_token_cookie' in cookie:
                cookies['refresh_token_cookie'] = cookie.split(';')[0].split('=')[1]
        
        # Refresh token
        client.set_cookie('localhost', 'refresh_token_cookie', cookies.get('refresh_token_cookie', ''))
        response = client.post('/api/auth/refresh')
        
        assert response.status_code == 200
        assert 'access_token' in response.json
        
        # Check that new refresh token cookie is set (rotation)
        new_cookies = response.headers.getlist('Set-Cookie')
        assert any('refresh_token_cookie' in cookie for cookie in new_cookies)
    
    def test_refresh_without_token(self, client):
        """Test refresh without refresh token"""
        response = client.post('/api/auth/refresh')
        
        assert response.status_code == 401


class TestLogout:
    """Test user logout"""
    
    def test_logout_success(self, client, auth_headers):
        """Test successful logout"""
        response = client.post('/api/auth/logout', headers=auth_headers)
        
        assert response.status_code == 200
        assert 'logged out' in response.json['message'].lower()
        
        # Check that cookies are cleared
        cookies = response.headers.getlist('Set-Cookie')
        assert any('refresh_token_cookie' in cookie for cookie in cookies)


class TestForgotPassword:
    """Test forgot password flow"""
    
    def test_forgot_password_success(self, client, verified_user):
        """Test forgot password request"""
        response = client.post('/api/auth/forgot-password', json={
            'email': verified_user.email
        })
        
        assert response.status_code == 200
        assert 'dev_token' in response.json  # Development mode
    
    def test_forgot_password_nonexistent_email(self, client):
        """Test forgot password with non-existent email"""
        response = client.post('/api/auth/forgot-password', json={
            'email': 'nonexistent@example.com'
        })
        
        # Should still return success to prevent email enumeration
        assert response.status_code == 200


class TestResetPassword:
    """Test password reset flow"""
    
    def test_reset_password_success(self, client, db, verified_user):
        """Test successful password reset"""
        # Create reset token
        token = PasswordResetToken(
            user_id=verified_user.id,
            token='reset-token-123'
        )
        db.session.add(token)
        db.session.commit()
        
        response = client.post('/api/auth/reset-password', json={
            'token': 'reset-token-123',
            'password': 'NewValidP@ss123!'
        })
        
        assert response.status_code == 200
        assert 'changed successfully' in response.json['message'].lower()
        
        # Verify password was changed
        db.session.refresh(verified_user)
        assert verified_user.check_password('NewValidP@ss123!')
    
    def test_reset_password_invalid_token(self, client):
        """Test reset with invalid token"""
        response = client.post('/api/auth/reset-password', json={
            'token': 'invalid-token',
            'password': 'NewValidP@ss123!'
        })
        
        assert response.status_code == 400
        assert 'invalid' in response.json['message'].lower()
    
    def test_reset_password_weak_password(self, client, db, verified_user):
        """Test reset with weak password"""
        token = PasswordResetToken(
            user_id=verified_user.id,
            token='reset-token-456'
        )
        db.session.add(token)
        db.session.commit()
        
        response = client.post('/api/auth/reset-password', json={
            'token': 'reset-token-456',
            'password': 'weak'
        })
        
        assert response.status_code == 400


class TestProtectedEndpoint:
    """Test protected endpoints"""
    
    def test_get_current_user_success(self, client, auth_headers, verified_user):
        """Test getting current user profile"""
        response = client.get('/api/auth/me', headers=auth_headers)
        
        assert response.status_code == 200
        assert 'user' in response.json
        assert response.json['user']['email'] == verified_user.email
    
    def test_get_current_user_without_token(self, client):
        """Test accessing protected endpoint without token"""
        response = client.get('/api/auth/me')
        
        assert response.status_code == 401
