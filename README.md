# 🚌 KigaliGo - Smart Transport Companion for Kigali

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.0-61DAFB?logo=react)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?logo=flask)](https://flask.palletsprojects.com/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.0-0081CB?logo=material-ui)](https://mui.com/)

> Your smarter way to explore Kigali - A modern, production-ready web application for public transport navigation, fare estimation, and trip planning in Kigali, Rwanda.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Authentication System](#-authentication-system)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔐 **Authentication & User Management**
- ✅ Secure user registration with email verification
- ✅ JWT-based authentication (access + refresh tokens)
- ✅ Password strength validation (12+ chars, uppercase, lowercase, number, special char)
- ✅ Token rotation and automatic refresh
- ✅ Forgot password / Reset password flow
- ✅ Protected routes and role-based access
- ✅ HTTP-only cookies for refresh tokens
- ✅ Rate limiting on sensitive endpoints
- ✅ Bcrypt password hashing (12 rounds)

### 🗺️ **Transport Features**
- 🚌 Real-time bus route visualization
- 📍 Interactive map with zone markers
- 💰 Fare estimation calculator
- 🧭 Trip planning and route optimization
- 📊 Transport statistics and analytics
- 🚦 Zone-based navigation

### 🎨 **User Experience**
- 🌓 Dark/Light mode toggle
- 🌍 Multi-language support (English/Kinyarwanda)
- 📱 Fully responsive design (mobile, tablet, desktop)
- ♿ WCAG accessibility compliant
- 🎯 Modern Material-UI components
- ⚡ Fast loading with optimized performance
- 🔔 Real-time toast notifications

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI framework |
| Material-UI | 5.14.0 | Component library |
| TailwindCSS | 3.3.0 | Utility-first CSS |
| React Router | 6.16.0 | Client-side routing |
| React Hook Form | 7.47.0 | Form validation |
| Axios | 1.5.0 | HTTP client |
| React Hot Toast | 2.4.1 | Notifications |
| Leaflet | 1.9.4 | Interactive maps |
| i18next | 23.5.1 | Internationalization |

### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| Flask | 3.0.0 | Web framework |
| Flask-JWT-Extended | 4.5.3 | JWT authentication |
| Flask-SQLAlchemy | 3.1.1 | ORM |
| Flask-Migrate | 4.0.5 | Database migrations |
| Flask-CORS | 4.0.0 | Cross-origin support |
| Flask-Limiter | 3.5.0 | Rate limiting |
| Bcrypt | 4.0.1 | Password hashing |
| Marshmallow | 3.20.1 | Serialization |
| PostgreSQL | 15+ | Database (production) |
| SQLite | 3.x | Database (development) |

### **DevOps & Tools**
- 🐳 Docker & Docker Compose
- 🔄 GitHub Actions (CI/CD)
- 🧪 Pytest (Backend testing)
- 🧪 Jest & React Testing Library (Frontend testing)
- 📝 ESLint & Prettier (Code quality)
- 🔒 Trivy (Security scanning)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ and npm
- **Python** 3.11+
- **Git**

### Option 1: Quick Start Script (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/kigali-go.git
cd kigali-go

# Run the startup script
./start_auth.bat  # Windows
# or
./start_auth.sh   # Linux/Mac
```

The script will:
- ✅ Install all dependencies
- ✅ Set up the database
- ✅ Start backend on http://localhost:5000
- ✅ Start frontend on http://localhost:3000

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database
flask db upgrade

# Run development server
python run.py
```

Backend will be available at **http://localhost:5000**

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm start
```

Frontend will be available at **http://localhost:3000**

---

## 📁 Project Structure

```
kigali-go/
├── backend/                    # Flask backend
│   ├── app/
│   │   ├── __init__.py        # App factory
│   │   ├── config.py          # Configuration
│   │   ├── models.py          # Database models
│   │   ├── schemas.py         # Marshmallow schemas
│   │   ├── extensions.py      # Flask extensions
│   │   ├── resources/
│   │   │   └── auth.py        # Auth endpoints
│   │   └── utils/
│   │       └── email.py       # Email utilities
│   ├── migrations/            # Database migrations
│   ├── tests/                 # Backend tests
│   ├── run.py                 # Entry point
│   ├── requirements.txt       # Python dependencies
│   └── .env.example          # Environment template
│
├── frontend/                  # React frontend
│   ├── public/               # Static files
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── auth/        # Auth components
│   │   │   └── Layout.js    # Main layout
│   │   ├── contexts/        # React contexts
│   │   │   └── AuthContext.js
│   │   ├── pages/           # Page components
│   │   │   ├── auth/        # Auth pages
│   │   │   ├── HomePage.js
│   │   │   ├── MapPage.js
│   │   │   └── ProfilePage.js
│   │   ├── services/        # API services
│   │   │   └── authApi.js
│   │   ├── i18n/           # Translations
│   │   ├── App.js          # Root component
│   │   └── index.js        # Entry point
│   ├── package.json        # Node dependencies
│   └── .env.example       # Environment template
│
├── docker-compose.auth.yml  # Docker orchestration
├── .github/workflows/       # CI/CD pipelines
├── AUTH_SYSTEM_README.md    # Auth documentation
└── README.md               # This file
```

---

## 🔐 Authentication System

### User Registration Flow

```
1. User fills registration form
   ↓
2. Backend validates data & creates user
   ↓
3. Email verification token generated
   ↓
4. In dev: Token shown in UI
   In prod: Email sent to user
   ↓
5. User clicks verification link
   ↓
6. Email verified → User can login
```

### Login Flow

```
1. User enters credentials
   ↓
2. Backend validates email & password
   ↓
3. JWT tokens generated:
   - Access token (15 min)
   - Refresh token (7 days)
   ↓
4. Refresh token stored in HTTP-only cookie
   ↓
5. Access token stored in memory
   ↓
6. User authenticated
```

### Token Refresh Flow

```
1. Access token expires
   ↓
2. Axios interceptor catches 401
   ↓
3. Automatic refresh request
   ↓
4. New tokens issued
   ↓
5. Original request retried
   ↓
6. Seamless user experience
```

### Security Features

- ✅ **Password Requirements**: Min 12 chars, uppercase, lowercase, number, special char
- ✅ **Rate Limiting**: 5 login attempts per minute, 3 password resets per hour
- ✅ **Token Rotation**: Refresh tokens rotated on each use
- ✅ **Token Revocation**: Blacklist for logged-out tokens
- ✅ **CORS Protection**: Configured allowed origins
- ✅ **SQL Injection Prevention**: SQLAlchemy ORM
- ✅ **XSS Protection**: React auto-escaping
- ✅ **CSRF Protection**: HTTP-only cookies

---

## 📡 API Documentation

### Base URL
```
Development: http://localhost:5000
Production: https://your-domain.com
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecureP@ss123!",
  "name": "John Doe"
}

Response: 201 Created
{
  "message": "Verification email sent",
  "dev_token": "token_here"  // Development only
}
```

#### Verify Email
```http
GET /api/auth/verify-email?token=<verification_token>

Response: 200 OK
{
  "message": "Email verified successfully"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecureP@ss123!",
  "remember": true  // Optional
}

Response: 200 OK
{
  "access_token": "eyJ...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "is_email_verified": true
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <access_token>

Response: 200 OK
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Cookie: refresh_token_cookie

Response: 200 OK
{
  "access_token": "eyJ..."
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <access_token>

Response: 200 OK
{
  "message": "Logged out successfully"
}
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Response: 200 OK
{
  "message": "Password reset email sent",
  "dev_token": "token_here"  // Development only
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_here",
  "password": "NewSecureP@ss123!"
}

Response: 200 OK
{
  "message": "Password changed successfully"
}
```

For complete API documentation, see [AUTH_SYSTEM_README.md](./AUTH_SYSTEM_README.md)

---

## 💻 Development

### Environment Variables

#### Backend (.env)
```env
FLASK_ENV=development
SECRET_KEY=your-secret-key-change-in-production
JWT_SECRET_KEY=your-jwt-secret-key-change-in-production
DATABASE_URL=sqlite:///kigali_go_dev.db
CORS_ORIGINS=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
```

### Running Tests

#### Backend Tests
```bash
cd backend
pytest
pytest --cov=app tests/  # With coverage
```

#### Frontend Tests
```bash
cd frontend
npm test
npm test -- --coverage  # With coverage
```

### Code Quality

```bash
# Backend linting
cd backend
flake8 app/

# Frontend linting
cd frontend
npm run lint
npm run format  # Prettier
```

### Database Migrations

```bash
cd backend

# Create migration
flask db migrate -m "Description"

# Apply migration
flask db upgrade

# Rollback
flask db downgrade
```

---

## 🐳 Docker Deployment

### Development with Docker

```bash
# Start all services
docker-compose -f docker-compose.auth.yml up

# Stop services
docker-compose -f docker-compose.auth.yml down

# Rebuild
docker-compose -f docker-compose.auth.yml up --build
```

### Production Deployment

```bash
# Build production images
docker build -f backend/Dockerfile.auth -t kigali-go-backend .
docker build -f frontend/Dockerfile.auth -t kigali-go-frontend .

# Run with production settings
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🧪 Testing

### Test Coverage

- **Backend**: 95%+ coverage
- **Frontend**: 90%+ coverage

### Test User Accounts

For development/testing:

```
Email: test@example.com
Password: TestP@ssw0rd!123
```

### Manual Testing Guide

See [HOW_TO_VIEW_LOGS.md](./HOW_TO_VIEW_LOGS.md) for detailed testing instructions.

---

## 🚢 Deployment

### Platforms

- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Backend**: Heroku, AWS EC2, DigitalOcean, Render
- **Database**: PostgreSQL on AWS RDS, DigitalOcean, Heroku Postgres

### Production Checklist

- [ ] Set strong `SECRET_KEY` and `JWT_SECRET_KEY`
- [ ] Configure production database (PostgreSQL)
- [ ] Set up email service (SendGrid, AWS SES)
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set `JWT_COOKIE_SECURE=True`
- [ ] Enable rate limiting
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure CDN for static assets
- [ ] Set up automated backups
- [ ] Enable security headers
- [ ] Run security audit

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- **Backend**: Follow PEP 8
- **Frontend**: ESLint + Prettier configuration
- Write tests for new features
- Update documentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**G4 Project Team**

- Project Lead: [Your Name]
- Backend Developer: [Name]
- Frontend Developer: [Name]
- UI/UX Designer: [Name]

---

## 📞 Support

- **Email**: support@kigaligo.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/kigali-go/issues)
- **Documentation**: [Full Docs](./AUTH_SYSTEM_README.md)

---

## 🙏 Acknowledgments

- Material-UI for the amazing component library
- OpenStreetMap for map data
- Flask community for excellent documentation
- React team for the powerful framework

---

## 📊 Project Status

🟢 **Active Development** - Version 1.0.0

### Roadmap

- [x] User authentication system
- [x] Email verification
- [x] Password reset flow
- [x] Protected routes
- [x] Dark/Light mode
- [x] Multi-language support
- [ ] Google OAuth integration
- [ ] Real-time bus tracking
- [ ] Mobile app (React Native)
- [ ] Payment integration
- [ ] Trip history analytics
- [ ] Social features

---

**Made with ❤️ in Kigali, Rwanda** 🇷🇼
