@echo off
echo ========================================
echo    KigaliGo Auth System Startup
echo    Production-Ready Authentication
echo ========================================
echo.

echo [1/4] Checking Backend Dependencies...
cd backend
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing/Updating dependencies...
pip install -q -r requirements.txt
if errorlevel 1 (
    echo Error installing dependencies. Please check requirements.txt
    pause
    exit /b 1
)
echo Backend dependencies ready!
echo.

echo [2/4] Checking Database...
if not exist "kigali_go_dev.db" (
    echo Initializing database...
    set FLASK_APP=run.py
    flask db upgrade
)
echo Database ready!
echo.

echo [3/4] Checking Frontend Dependencies...
cd ..\frontend
if not exist "node_modules" (
    echo Installing frontend dependencies (this may take a few minutes)...
    call npm install
)
echo Frontend dependencies ready!
echo.

echo [4/4] Starting Servers...
cd ..
echo.
echo Starting Backend Auth Server...
start "KigaliGo Auth Backend" cmd /k "cd backend && venv\Scripts\activate && python run.py"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo Starting Frontend...
start "KigaliGo Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo    Auth System Started Successfully!
echo ========================================
echo.
echo Frontend:        http://localhost:3000
echo Backend API:     http://localhost:5000
echo Health Check:    http://localhost:5000/health
echo.
echo Auth Pages:
echo - Sign Up:       http://localhost:3000/signup
echo - Sign In:       http://localhost:3000/signin
echo - Verify Email:  http://localhost:3000/verify-email
echo - Reset Password: http://localhost:3000/reset-password
echo.
echo Backend Logs:    Check "KigaliGo Auth Backend" window
echo Frontend Logs:   Check "KigaliGo Frontend" window
echo.
echo Press any key to exit...
pause > nul
