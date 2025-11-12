@echo off
echo ========================================
echo    KigaliGo - Quick Start
echo    Simple Development Mode
echo ========================================
echo.

echo [1/3] Starting Backend (SQLite)...
echo.
start "KigaliGo Backend" cmd /k "cd backend && python simple_app.py"
timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend...
echo.
start "KigaliGo Frontend" cmd /k "cd frontend && npm start"
timeout /t 2 /nobreak >nul

echo [3/3] Opening Browser...
timeout /t 5 /nobreak >nul
start http://localhost:3000

echo.
echo ========================================
echo    KigaliGo is Starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Two windows will open:
echo   1. Backend (Python/Flask)
echo   2. Frontend (React)
echo.
echo Press any key to exit this window...
echo (Backend and Frontend will keep running)
pause >nul
