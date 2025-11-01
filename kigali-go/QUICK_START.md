# KigaliGo Quick Start Guide

## 🚀 Running the Application

### One-Command Start
```bash
./run_project.sh
```

This script will:
- ✓ Check all prerequisites (Python 3, Node.js, npm)
- ✓ Create virtual environment (if needed)
- ✓ Install all dependencies automatically
- ✓ Start backend server on port 5000
- ✓ Start frontend server on port 3000
- ✓ Open browser automatically

## 📍 Application URLs

### Frontend (React)
- **Main Application**: http://localhost:3000
- Pages available:
  - Home Dashboard
  - Interactive Map
  - Plan Trip
  - Fare Estimator
  - Reports
  - Profile

### Backend (Flask API)
- **API Base**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **API Documentation**: http://localhost:5000/api/v1/docs
- **Statistics**: http://localhost:5000/api/v1/statistics
- **Nearby Vehicles**: http://localhost:5000/api/v1/vehicles/nearby?lat=-1.9441&lng=30.0619
- **Zones**: http://localhost:5000/api/v1/zones
- **Fare Estimation**: http://localhost:5000/api/v1/fare/estimate?distance_km=5.2&duration_minutes=15&mode=bus

## 🛑 Stopping the Application

Press `Ctrl+C` in the terminal where the script is running. This will automatically stop both servers.

## 📝 Log Files

- Backend logs: `backend/backend.log`
- Frontend logs: `frontend/frontend.log`

## 🔧 Manual Start (Alternative)

### Backend Only
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 simple_app.py
```

### Frontend Only
```bash
cd frontend
npm install
npm start
```

## ✅ Features

- **Transport Modes**: Bus, Moto (Motorcycle), Taxi
- **Live Statistics**: Real-time vehicle and zone data
- **Fare Calculator**: Estimate trip costs
- **Route Planning**: Find best routes
- **Reporting System**: Submit issues and feedback
- **Multi-language**: English, Kinyarwanda, Français

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti :5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti :3000 | xargs kill -9
```

### Clear Dependencies
```bash
# Backend
cd backend && rm -rf venv

# Frontend
cd frontend && rm -rf node_modules
```

## 📚 Sample Data

The application includes sample data for Kigali:

### Zones
- Nyabugogo (Nyarugenge District)
- Kimironko (Gasabo District)
- Kacyiru (Gasabo District)
- Remera (Gasabo District)
- Kicukiro (Kicukiro District)

### Vehicles
- 5 active vehicles (Buses, Motos, Taxis)
- Mix of Tap&Go and Private transport

### Fare Rates
- **Bus**: 500 RWF base + 150 RWF/km
- **Moto**: 800 RWF base + 300 RWF/km
- **Taxi**: 1200 RWF base + 400 RWF/km

## 🎯 Testing the App

1. **Backend Health Check**:
   ```bash
   curl http://localhost:5000/health
   ```

2. **Get Statistics**:
   ```bash
   curl http://localhost:5000/api/v1/statistics
   ```

3. **Frontend**: Open http://localhost:3000 in your browser

Enjoy using KigaliGo! 🚌🏍️🚗
