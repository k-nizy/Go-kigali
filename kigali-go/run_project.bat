@echo off
echo ========================================
echo    KigaliGo Project Startup Script
echo ========================================
echo.

echo Starting Backend Server...
start "KigaliGo Backend" cmd /k "cd backend && python simple_app.py"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo Starting Frontend (HTML Version)...
echo Opening frontend in browser...
start "" "frontend/index.html"

echo.
echo ========================================
echo    Project Started Successfully!
echo ========================================
echo.
echo Backend API: http://localhost:5000
echo Frontend: frontend/index.html
echo API Docs: http://localhost:5000/api/v1/docs
echo.
echo Press any key to exit...
pause > nul
