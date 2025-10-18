# 🚀 How to Run KigaliGo Project

This guide will help you run the KigaliGo project locally on your Windows machine.

## 📋 Prerequisites

- **Python 3.8+** (already installed on your system ✅)
- **Web Browser** (Chrome, Firefox, Edge, etc. ✅)

## 🚀 Quick Start (Easiest Method)

### Option 1: Use the Batch File (Recommended)
1. Double-click on `run_project.bat` in the kigali-go folder
2. This will automatically:
   - Start the backend server
   - Open the frontend in your browser
   - Show you all the important URLs

### Option 2: Manual Setup

#### Step 1: Start the Backend
1. Open Command Prompt or PowerShell
2. Navigate to the backend folder:
   ```cmd
   cd kigali-go\backend
   ```
3. Run the backend server:
   ```cmd
   python simple_app.py
   ```
4. You should see:
   ```
   🚀 Starting KigaliGo Backend Server...
   📍 API Documentation: http://localhost:5000/api/v1/docs
   ❤️ Health Check: http://localhost:5000/health
   🌍 Statistics: http://localhost:5000/api/v1/statistics
   * Running on http://0.0.0.0:5000
   ```

#### Step 2: Open the Frontend
1. Open your web browser
2. Navigate to: `kigali-go\frontend\index.html`
   - You can either:
     - Double-click the `index.html` file in File Explorer
     - Or open it in your browser: `file:///path/to/kigali-go/frontend/index.html`

## 🌐 Available URLs

### Backend API Endpoints:
- **Health Check**: http://localhost:5000/health
- **API Documentation**: http://localhost:5000/api/v1/docs
- **Statistics**: http://localhost:5000/api/v1/statistics
- **Nearby Vehicles**: http://localhost:5000/api/v1/vehicles/nearby?lat=-1.9441&lng=30.0619
- **Zones**: http://localhost:5000/api/v1/zones
- **Fare Estimation**: http://localhost:5000/api/v1/fare/estimate?distance_km=5.2&duration_minutes=15&mode=bus

### Frontend:
- **Main App**: Open `frontend/index.html` in your browser

## 🧪 Testing the Application

### 1. Test Backend API
Open these URLs in your browser to test the API:

1. **Health Check**: http://localhost:5000/health
   - Should return: `{"status": "healthy", "service": "kigali-go-api"}`

2. **Statistics**: http://localhost:5000/api/v1/statistics
   - Should return vehicle and zone counts

3. **Nearby Vehicles**: http://localhost:5000/api/v1/vehicles/nearby?lat=-1.9441&lng=30.0619
   - Should return a list of vehicles near Kigali center

### 2. Test Frontend
1. Open the frontend HTML file in your browser
2. Click the buttons to test different features:
   - **Load Statistics**: Shows system statistics
   - **Find Nearby Vehicles**: Shows vehicles near Kigali center
   - **Estimate Fare**: Calculates fare for a sample trip

## 📊 Sample Data Included

The application comes with sample data for Kigali:

### Vehicles:
- **Buses**: RAB001A, RAB002A (Tap&Go)
- **Motorcycles**: RAB003A, RAB005A (Private)
- **Taxis**: RAB004A (Private)

### Zones:
- **Nyabugogo** (Nyarugenge District)
- **Kimironko** (Gasabo District)
- **Kacyiru** (Gasabo District)
- **Remera** (Gasabo District)
- **Kicukiro** (Kicukiro District)

### Fare Rules:
- **Bus**: 500 RWF base + 150 RWF per km
- **Moto**: 800 RWF base + 300 RWF per km
- **Taxi**: 1200 RWF base + 400 RWF per km

## 🔧 Troubleshooting

### Backend Issues:
1. **Port 5000 already in use**:
   - Close other applications using port 5000
   - Or change the port in `simple_app.py` (line 150)

2. **Python not found**:
   - Make sure Python is installed and in your PATH
   - Try `python3` instead of `python`

3. **Module not found**:
   - Install Flask: `pip install Flask Flask-CORS`

### Frontend Issues:
1. **CORS errors**:
   - Make sure the backend is running
   - Check that the API_BASE URL is correct

2. **API not responding**:
   - Check that backend is running on http://localhost:5000
   - Test the health endpoint first

## 🎯 Features Available

### ✅ Working Features:
- **Backend API** with SQLite database
- **Statistics endpoint** showing vehicle and zone counts
- **Vehicle tracking** with nearby vehicle search
- **Fare estimation** for different transport modes
- **Route planning** with multiple transport options
- **Zones and stops** data for Kigali
- **Frontend interface** with interactive buttons
- **Real-time data** from the backend API

### 🚀 Future Enhancements:
- Google Maps integration
- Real-time vehicle tracking
- User authentication
- Trip history
- Mobile app
- Payment integration

## 📱 Mobile Testing

The frontend is responsive and works on mobile devices:
1. Open the HTML file on your phone
2. Or use browser developer tools to simulate mobile view
3. Test the responsive design

## 🔄 Stopping the Application

1. **Backend**: Press `Ctrl+C` in the backend terminal
2. **Frontend**: Close the browser tab
3. **Batch file**: Close the command windows

## 🆘 Need Help?

If you encounter any issues:
1. Check that Python is installed: `python --version`
2. Check that Flask is installed: `pip list | findstr Flask`
3. Make sure port 5000 is not blocked by firewall
4. Try opening http://localhost:5000/health in your browser

## 🎉 Success!

If everything is working, you should see:
- Backend running on port 5000
- Frontend displaying KigaliGo interface
- API endpoints responding with data
- Interactive buttons working in the frontend

Enjoy exploring KigaliGo! 🚌🏍️🚗
