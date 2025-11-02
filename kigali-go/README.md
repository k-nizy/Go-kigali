# 🚍 KigaliGo - Smart Urban Mobility Platform

A comprehensive public transportation solution for Kigali, providing real-time tracking, route planning, and fare estimation to improve urban mobility.

## ✨ Features

- 🗺️ Real-time vehicle tracking on interactive maps
- 🚌 Multi-modal trip planning (buses, taxis, walking)
- 💰 Accurate fare estimation before booking
- 🚏 Nearby stops and vehicle locations
- 📱 Mobile-friendly Progressive Web App (PWA)
- 🛡️ Safety reporting and feedback system

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- Python 3.10+ with pip
- PostgreSQL 14+ with PostGIS extension
- Git 2.30+

### Local Development Setup

1. **Clone and setup:**
```bash
git clone <repository-url>
cd kigali-go
```

2. **Backend setup:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your database credentials
flask db upgrade
python scripts/seed_db.py
flask run
```

3. **Frontend setup (in new terminal):**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL and Google Maps key
npm run dev
```

4. **Access the app:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api/docs

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React PWA     │    │   Flask API     │    │   PostgreSQL    │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
│   Vercel        │    │   Render        │    │   Cloud DB      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎨 Design Philosophy

KigaliGo features a Rwanda-inspired design with:
- **Colors:** Inspired by Rwanda flag and Kigali urban palette
- **Typography:** Poppins + Inter font pairing
- **Icons:** Handcrafted SVGs with Imigongo motifs
- **Localization:** English + Kinyarwanda support
- **Mobile-first:** PWA with offline capabilities

## 📱 Features

- **Trip Planning:** Multi-modal route planning with fare estimation
- **Live Map:** Real-time vehicle tracking and ETAs
- **Fare Calculator:** Tap&Go and moto/taxi fare estimation
- **Safety Reports:** Passenger feedback and safety reporting
- **Offline Support:** PWA with cached data for offline use

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- TailwindCSS + Custom Design System
- Google Maps API
- PWA (Workbox)
- i18n (react-i18next)

### Backend
- Python 3.10+ + Flask
- PostgreSQL + PostGIS
- SQLAlchemy + Flask-Migrate
- RESTful API with OpenAPI docs

### Deployment
- Frontend: Vercel
- Backend: Render/Heroku
- Database: Cloud PostgreSQL

## 📊 Database Schema

See [docs/database-schema.md](docs/database-schema.md) for detailed ERD and table descriptions.

## 🔌 API Documentation

Interactive API documentation available at `/api/docs` when running the backend.

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect repository to Vercel
2. Set environment variables:
   - `REACT_APP_API_URL`
   - `REACT_APP_GOOGLE_MAPS_KEY`
3. Deploy

### Backend (Render)
1. Connect repository to Render
2. Set environment variables:
   - `DATABASE_URL`
   - `SECRET_KEY`
   - `GOOGLE_MAPS_API_KEY`
3. Deploy

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🎯 Roadmap

- [ ] Real-time vehicle tracking integration
- [ ] Mobile app (React Native)
- [ ] Driver dashboard
- [ ] Payment integration
- [ ] Advanced analytics

---

**Built with ❤️ for Kigali by Team KigaliMobility**
