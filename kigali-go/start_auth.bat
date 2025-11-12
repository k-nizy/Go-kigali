@echo off
echo ========================================
echo    Starting KigaliGo Auth System
echo ========================================
echo.

echo Starting Backend on http://localhost:5000...
start "Backend - Auth API" cmd /k "cd backend && python run.py"

timeout /t 3 /nobreak > nul

echo Starting Frontend on http://localhost:3000...
start "Frontend - React App" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Check the opened windows for logs.
echo.
