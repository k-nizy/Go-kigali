# KigaliGo Production-Ready Authentication System

Complete, secure, and production-ready authentication system with Flask backend and React frontend.

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Clone repository
git clone <repository-url>
cd kigali-go

# Set environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit backend/.env with your secrets
# At minimum, change SECRET_KEY and JWT_SECRET_KEY

# Start all services
docker-compose -f docker-compose.auth.yml up -d

# View logs
docker-compose -f docker-compose.auth.yml logs -f

# Stop services
docker-compose -f docker-compose.auth.yml down
```

**Services will be available at:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5432

### Manual Setup

#### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Initialize database
flask db upgrade

# Run development server
flask run

# Or production with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with API URL

# Run development server
npm start

# Build for production
npm run build
```

## 📋 Features

### Backend Features
- ✅ User registration with email verification
- ✅ Secure login with JWT (access + refresh tokens)
- ✅ Token rotation and revocation
- ✅ Password reset flow with time-limited tokens
- ✅ Rate limiting (5 login attempts/min, 3 password resets/hour)
- ✅ Bcrypt password hashing (12 rounds)
- ✅ HTTP-only cookies for refresh tokens
- ✅ CORS configuration
- ✅ Comprehensive input validation
- ✅ Database migrations
- ✅ Full test coverage

### Frontend Features
- ✅ Sign in / Sign up pages
- ✅ Email verification flow
- ✅ Password reset flow
- ✅ Protected routes with auto-redirect
- ✅ Automatic token refresh
- ✅ Password strength indicator
- ✅ Remember me functionality
- ✅ Accessible forms (ARIA)
- ✅ Loading states and error handling
- ✅ Toast notifications
- ✅ Comprehensive tests

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Flask 2.3.3
- Flask-JWT-Extended (JWT auth)
- Flask-SQLAlchemy (ORM)
- Flask-Migrate (migrations)
- Flask-Limiter (rate limiting)
- Flask-CORS
- Marshmallow (validation)
- Bcrypt (password hashing)
- PostgreSQL / SQLite
- Pytest (testing)

**Frontend:**
- React 18
- Material-UI 7
- TailwindCSS 3
- React Router DOM v6
- React Hook Form
- Axios
- React Hot Toast
- Lucide Icons
- Jest + React Testing Library

### Project Structure

```
kigali-go/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # App factory
│   │   ├── config.py            # Configuration
│   │   ├── extensions.py        # Flask extensions
│   │   ├── models.py            # Database models
│   │   ├── schemas.py           # Validation schemas
│   │   ├── resources/
│   │   │   └── auth.py          # Auth endpoints
│   │   └── utils/
│   │       └── email.py         # Email utilities
│   ├── tests/
│   │   ├── conftest.py          # Test fixtures
│   │   └── test_auth.py         # Auth tests
│   ├── migrations/              # Database migrations
│   ├── run.py                   # Entry point
│   ├── requirements.txt
│   ├── .env.example
│   ├── Dockerfile.auth
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/auth/
│   │   │   ├── PrivateRoute.js
│   │   │   └── PasswordStrengthIndicator.js
│   │   ├── contexts/
│   │   │   └── AuthContext.js   # Auth state management
│   │   ├── hooks/
│   │   │   └── usePasswordStrength.js
│   │   ├── pages/auth/
│   │   │   ├── SignIn.js
│   │   │   ├── SignUp.js
│   │   │   ├── ForgotPassword.js
│   │   │   ├── ResetPassword.js
│   │   │   └── VerifyEmail.js
│   │   └── services/
│   │       └── authApi.js       # API service
│   ├── .env.example
│   ├── Dockerfile.auth
│   ├── nginx.conf
│   └── AUTH_README.md
│
├── docker-compose.auth.yml
├── .github/workflows/auth-ci.yml
└── AUTH_SYSTEM_README.md (this file)
```

## 🔐 Security Features

### Password Security
- Minimum 12 characters
- Must contain: uppercase, lowercase, number, special character
- Bcrypt hashing with 12 rounds
- No plain text storage

### Token Management
- **Access tokens**: 15-minute expiration, stored in memory
- **Refresh tokens**: 7-day expiration (30 days with "remember me")
- Token rotation on each refresh
- Token revocation via blocklist
- HTTP-only cookies for refresh tokens

### Rate Limiting
- Login: 5 attempts per minute per IP
- Password reset: 3 attempts per hour per IP
- Configurable via Flask-Limiter

### Additional Security
- CORS with configurable origins
- CSRF protection (production)
- Input validation (client + server)
- SQL injection prevention (SQLAlchemy ORM)
- XSS prevention (React escaping + CSP headers)

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api/auth
```

### Endpoints

#### 1. Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "ValidP@ssw0rd!123",
  "name": "Kevin"
}

Response: 201
{
  "message": "Verification email sent",
  "dev_token": "token-here"  // Only in development
}
```

#### 2. Verify Email
```http
GET /api/auth/verify-email?token=<token>

Response: 200
{
  "message": "Email verified successfully"
}
```

#### 3. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "ValidP@ssw0rd!123",
  "remember": true
}

Response: 200
{
  "access_token": "eyJ0eXAi...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Kevin",
    "is_email_verified": true
  }
}
+ Sets refresh_token cookie
```

#### 4. Refresh Token
```http
POST /api/auth/refresh
Cookie: refresh_token_cookie=<token>

Response: 200
{
  "access_token": "eyJ0eXAi..."
}
+ Rotates refresh_token cookie
```

#### 5. Logout
```http
POST /api/auth/logout
Authorization: Bearer <access-token>

Response: 200
{
  "message": "Logged out successfully"
}
+ Clears refresh_token cookie
```

#### 6. Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Response: 200
{
  "message": "If the email exists, a reset link has been sent",
  "dev_token": "token-here"  // Only in development
}
```

#### 7. Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token",
  "password": "NewValidP@ss123!"
}

Response: 200
{
  "message": "Password changed successfully"
}
```

#### 8. Get Current User
```http
GET /api/auth/me
Authorization: Bearer <access-token>

Response: 200
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

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# With coverage
pytest --cov=app --cov-report=html

# Specific test
pytest tests/test_auth.py::TestLogin::test_login_success

# Watch mode
pytest-watch
```

**Test Coverage:**
- User registration (success, duplicate, validation)
- Email verification
- Login (success, invalid, unverified, rate limit)
- Token refresh and rotation
- Logout and revocation
- Password reset flow
- Protected endpoints

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# With coverage
npm test -- --coverage

# Specific test
npm test SignIn.test.js

# Watch mode (default)
npm test
```

**Test Coverage:**
- AuthContext initialization
- Sign in form validation
- Sign up form validation
- Protected route behavior
- Token refresh flow
- Error handling

## 🚢 Deployment

### Environment Variables

**Backend (.env):**
```bash
FLASK_ENV=production
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
DATABASE_URL=postgresql://user:pass@host:5432/dbname
CORS_ORIGINS=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

**Frontend (.env):**
```bash
REACT_APP_API_URL=https://api.yourdomain.com
```

### Docker Deployment

```bash
# Build images
docker-compose -f docker-compose.auth.yml build

# Start services
docker-compose -f docker-compose.auth.yml up -d

# View logs
docker-compose -f docker-compose.auth.yml logs -f backend

# Stop services
docker-compose -f docker-compose.auth.yml down

# Remove volumes (caution: deletes data)
docker-compose -f docker-compose.auth.yml down -v
```

### Production Checklist

- [ ] Change all secret keys in `.env`
- [ ] Set `FLASK_ENV=production`
- [ ] Use PostgreSQL (not SQLite)
- [ ] Enable HTTPS
- [ ] Set `JWT_COOKIE_SECURE=True`
- [ ] Enable CSRF protection
- [ ] Configure email service (SendGrid, AWS SES, etc.)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up SSL certificates
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Set up CI/CD pipeline

## 🔧 Configuration

### Backend Configuration

Edit `backend/app/config.py`:

```python
# JWT token expiration
JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)

# Bcrypt rounds (higher = more secure but slower)
BCRYPT_LOG_ROUNDS = 12

# Token expiration
EMAIL_VERIFICATION_TOKEN_EXPIRES = timedelta(hours=24)
PASSWORD_RESET_TOKEN_EXPIRES = timedelta(hours=1)
```

### Frontend Configuration

Edit `frontend/src/services/authApi.js`:

```javascript
// API timeout
timeout: 10000  // 10 seconds
```

## 📊 Monitoring

### Health Checks

**Backend:**
```bash
curl http://localhost:5000/health
```

**Frontend:**
```bash
curl http://localhost:3000/health
```

### Logs

**Docker logs:**
```bash
# Backend logs
docker-compose -f docker-compose.auth.yml logs -f backend

# Frontend logs
docker-compose -f docker-compose.auth.yml logs -f frontend

# Database logs
docker-compose -f docker-compose.auth.yml logs -f postgres
```

## 🐛 Troubleshooting

### Common Issues

**1. CORS errors**
- Check `CORS_ORIGINS` in backend `.env`
- Ensure frontend URL is included
- Verify `withCredentials: true` in axios

**2. Token not persisting**
- Check browser cookies are enabled
- Verify cookie domain and path
- Check `JWT_COOKIE_SECURE` setting

**3. Database connection failed**
- Verify PostgreSQL is running
- Check `DATABASE_URL` format
- Ensure database exists

**4. Email not sending**
- Check email service configuration
- In development, check logs for tokens
- Verify SMTP credentials

**5. Tests failing**
- Clear test database: `pytest --create-db`
- Check test environment variables
- Verify all dependencies installed

## 📚 Additional Documentation

- **Backend**: See `backend/README.md`
- **Frontend**: See `frontend/AUTH_README.md`
- **API**: See inline documentation in `backend/app/resources/auth.py`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Follow code style (PEP 8 for Python, ESLint for JavaScript)
4. Write tests for new features
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open Pull Request

### Code Quality

**Backend:**
```bash
# Linting
flake8 app/

# Type checking
mypy app/

# Format
black app/
```

**Frontend:**
```bash
# Linting
npm run lint

# Format
npm run format
```

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Email**: support@kigaligo.com
- **Documentation**: See README files in backend/ and frontend/

## ✅ Acceptance Criteria Status

All acceptance criteria from the specification have been met:

✅ Register creates user with email verification  
✅ Email verification with 24h token expiration  
✅ Login issues access (15m) and refresh (7d) tokens  
✅ Refresh rotates tokens  
✅ Logout revokes tokens  
✅ Forgot/reset password with time-limited tokens  
✅ Rate limiting enforced (5 login/min, 3 reset/hour)  
✅ Frontend validates client-side and shows server errors  
✅ Protected routes redirect when unauthenticated  
✅ Tokens auto-refresh on expiration  
✅ Remember me affects session duration  
✅ Comprehensive test coverage  

## 🎯 Next Steps

1. **Email Integration**: Configure production email service (SendGrid, AWS SES)
2. **OAuth**: Add Google/Facebook OAuth (optional)
3. **2FA**: Implement two-factor authentication (optional)
4. **Monitoring**: Set up Sentry or similar for error tracking
5. **Analytics**: Add user analytics and metrics
6. **Documentation**: Generate API docs with Swagger/OpenAPI

---

**Built with ❤️ for KigaliGo**
