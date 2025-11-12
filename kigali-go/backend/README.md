# KigaliGo Authentication Backend

Production-ready authentication system built with Flask, featuring JWT tokens, email verification, password reset, and comprehensive security measures.

## Features

- ✅ User registration with email verification
- ✅ Secure login with JWT access & refresh tokens
- ✅ Token rotation and revocation
- ✅ Password reset flow
- ✅ Rate limiting on sensitive endpoints
- ✅ HTTP-only cookies for refresh tokens
- ✅ Bcrypt password hashing (12 rounds)
- ✅ Comprehensive input validation
- ✅ Full test coverage

## Tech Stack

- **Flask 2.3.3** - Web framework
- **Flask-JWT-Extended** - JWT authentication
- **Flask-SQLAlchemy** - ORM
- **Flask-Migrate** - Database migrations
- **Flask-Limiter** - Rate limiting
- **Flask-CORS** - CORS support
- **Marshmallow** - Schema validation
- **Bcrypt** - Password hashing
- **PostgreSQL/SQLite** - Database
- **Pytest** - Testing

## Project Structure

```
backend/
├── app/
│   ├── __init__.py          # Application factory
│   ├── config.py            # Configuration
│   ├── extensions.py        # Flask extensions
│   ├── models.py            # Database models
│   ├── schemas.py           # Marshmallow schemas
│   ├── resources/
│   │   └── auth.py          # Auth endpoints
│   └── utils/
│       └── email.py         # Email utilities
├── tests/
│   ├── conftest.py          # Test fixtures
│   └── test_auth.py         # Auth tests
├── migrations/              # Database migrations
├── run.py                   # Application entry point
├── requirements.txt         # Python dependencies
├── .env.example            # Environment variables template
└── README.md               # This file
```

## Setup Instructions

### 1. Prerequisites

- Python 3.8+
- PostgreSQL (for production) or SQLite (for development)
- Virtual environment tool (venv, virtualenv, or conda)

### 2. Installation

```bash
# Clone the repository
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
# At minimum, change:
# - SECRET_KEY
# - JWT_SECRET_KEY
# - DATABASE_URL (for production)
```

### 4. Database Setup

```bash
# Initialize database migrations
flask db init

# Create initial migration
flask db migrate -m "Initial migration"

# Apply migrations
flask db upgrade
```

### 5. Run Development Server

```bash
# Using Flask development server
flask run

# Or using the run script
python run.py

# Server will start at http://localhost:5000
```

### 6. Run with Gunicorn (Production)

```bash
gunicorn -w 4 -b 0.0.0.0:8000 "app:create_app()"
```

## API Documentation

### Base URL
```
http://localhost:5000/api/auth
```

### Endpoints

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "ValidP@ssw0rd!123",
  "name": "Kevin"
}
```

**Success Response (201):**
```json
{
  "message": "Verification email sent",
  "dev_token": "token-here-in-dev-mode"
}
```

**Error Responses:**
- `400` - Validation error
- `409` - Email already registered

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"ValidP@ssw0rd!123","name":"Kevin"}'
```

---

#### 2. Verify Email
```http
GET /api/auth/verify-email?token=<verification-token>
```

**Success Response (200):**
```json
{
  "message": "Email verified successfully"
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/auth/verify-email?token=YOUR_TOKEN"
```

---

#### 3. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "ValidP@ssw0rd!123",
  "remember": true
}
```

**Success Response (200):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Kevin",
    "is_email_verified": true,
    "created_at": "2024-01-01T00:00:00",
    "last_login": "2024-01-01T12:00:00"
  }
}
```

**Note:** Refresh token is set as HTTP-only cookie

**Rate Limit:** 5 requests per minute per IP

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"ValidP@ssw0rd!123"}' \
  -c cookies.txt
```

---

#### 4. Refresh Token
```http
POST /api/auth/refresh
Cookie: refresh_token_cookie=<refresh-token>
```

**Success Response (200):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Note:** New refresh token is set as cookie (token rotation)

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -b cookies.txt \
  -c cookies.txt
```

---

#### 5. Logout
```http
POST /api/auth/logout
Authorization: Bearer <access-token>
Cookie: refresh_token_cookie=<refresh-token>
```

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -b cookies.txt
```

---

#### 6. Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "If the email exists, a reset link has been sent",
  "dev_token": "token-here-in-dev-mode"
}
```

**Rate Limit:** 3 requests per hour per IP

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

---

#### 7. Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "password": "NewValidP@ss123!"
}
```

**Success Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"YOUR_RESET_TOKEN","password":"NewValidP@ss123!"}'
```

---

#### 8. Get Current User
```http
GET /api/auth/me
Authorization: Bearer <access-token>
```

**Success Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Kevin",
    "is_email_verified": true,
    "created_at": "2024-01-01T00:00:00",
    "last_login": "2024-01-01T12:00:00"
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Password Requirements

Passwords must meet the following criteria:
- Minimum 12 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*(),.?":{}|<>)

## Security Features

### Token Management
- **Access tokens**: 15-minute expiration
- **Refresh tokens**: 7-day expiration (30 days with "remember me")
- **Token rotation**: New refresh token issued on each refresh
- **Token revocation**: Blocklist for logged-out tokens

### Password Security
- Bcrypt hashing with 12 rounds
- No password storage in plain text
- Secure password reset flow with time-limited tokens

### Rate Limiting
- Login: 5 attempts per minute per IP
- Forgot password: 3 attempts per hour per IP
- Configurable limits via Flask-Limiter

### CORS
- Configurable allowed origins
- Credentials support for cookies
- Secure headers

## Testing

### Run All Tests
```bash
pytest
```

### Run with Coverage
```bash
pytest --cov=app --cov-report=html
```

### Run Specific Test File
```bash
pytest tests/test_auth.py
```

### Run Specific Test
```bash
pytest tests/test_auth.py::TestLogin::test_login_success
```

### Test Coverage

The test suite includes:
- ✅ User registration (success, duplicate email, validation)
- ✅ Email verification (valid/invalid tokens)
- ✅ Login (success, invalid credentials, unverified email)
- ✅ Rate limiting enforcement
- ✅ Token refresh and rotation
- ✅ Logout and token revocation
- ✅ Forgot password flow
- ✅ Password reset (valid/invalid tokens)
- ✅ Protected endpoint access

## Database Migrations

### Create Migration
```bash
flask db migrate -m "Description of changes"
```

### Apply Migration
```bash
flask db upgrade
```

### Rollback Migration
```bash
flask db downgrade
```

### View Migration History
```bash
flask db history
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `FLASK_ENV` | Environment (development/production) | development | No |
| `SECRET_KEY` | Flask secret key | - | Yes |
| `JWT_SECRET_KEY` | JWT signing key | - | Yes |
| `DATABASE_URL` | Database connection string | sqlite:///kigali_go_dev.db | Yes |
| `CORS_ORIGINS` | Allowed CORS origins | http://localhost:3000 | No |
| `MAIL_SERVER` | SMTP server | smtp.gmail.com | No |
| `MAIL_PORT` | SMTP port | 587 | No |
| `MAIL_USERNAME` | Email username | - | No |
| `MAIL_PASSWORD` | Email password | - | No |
| `FRONTEND_URL` | Frontend URL for email links | http://localhost:3000 | No |

## Production Deployment

### 1. Set Environment Variables
```bash
export FLASK_ENV=production
export SECRET_KEY="your-production-secret-key"
export JWT_SECRET_KEY="your-production-jwt-key"
export DATABASE_URL="postgresql://user:pass@host:5432/dbname"
```

### 2. Run Database Migrations
```bash
flask db upgrade
```

### 3. Start with Gunicorn
```bash
gunicorn -w 4 -b 0.0.0.0:8000 "app:create_app()" --access-logfile - --error-logfile -
```

### 4. Use Process Manager (systemd/supervisor)
```bash
# Example systemd service
[Unit]
Description=KigaliGo Auth API
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/backend
Environment="PATH=/path/to/venv/bin"
ExecStart=/path/to/venv/bin/gunicorn -w 4 -b 0.0.0.0:8000 "app:create_app()"

[Install]
WantedBy=multi-user.target
```

## Troubleshooting

### Database Connection Issues
```bash
# Check DATABASE_URL format
# SQLite: sqlite:///path/to/db.db
# PostgreSQL: postgresql://user:pass@host:5432/dbname

# Test connection
python -c "from app import create_app; app = create_app(); app.app_context().push(); from app.extensions import db; db.create_all()"
```

### Migration Issues
```bash
# Reset migrations (development only!)
rm -rf migrations/
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

### Token Issues
```bash
# Clear token blocklist (development only!)
python -c "from app import create_app; from app.extensions import db; from app.models import TokenBlocklist; app = create_app(); app.app_context().push(); TokenBlocklist.query.delete(); db.session.commit()"
```

## Contributing

1. Follow PEP 8 style guide
2. Add type hints where practical
3. Write tests for new features
4. Update documentation
5. Run tests before committing

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)
- Email: support@kigaligo.com
