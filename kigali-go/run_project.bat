@echo off
echo ========================================
echo    KigaliGo Project Startup Script
echo    Spotify-Style Material-UI Version
echo ========================================
echo.

echo [1/3] Installing Backend Dependencies...
cd backend
python -m pip install -q Flask==2.3.3 Flask-CORS==4.0.0 2>nul
if errorlevel 1 (
    echo Installing Flask and Flask-CORS...
    python -m pip install Flask Flask-CORS
)
echo Backend dependencies ready!
echo.

echo [2/3] Installing Frontend Dependencies...
cd ..\frontend
if not exist "node_modules\@mui" (
    echo Installing Material-UI packages...
    call npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
)
echo Frontend dependencies ready!
echo.

echo [3/3] Starting Servers...
cd ..
echo Starting Backend Server...
start "KigaliGo Backend" cmd /k "cd backend && python simple_app.py"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo Starting Frontend (React + Material-UI)...
start "KigaliGo Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo    Project Started Successfully!
echo ========================================
echo.
echo Frontend (Spotify-style UI): http://localhost:3000
echo Backend API:                 http://localhost:5000
echo API Docs:                    http://localhost:5000/api/v1/docs
echo Health Check:                http://localhost:5000/health
echo.
echo UI Features:
echo - Material-UI components
echo - Spotify-inspired dark theme
echo - Sidebar navigation
echo - Responsive design
echo.
echo Press any key to exit...
pause > nul
