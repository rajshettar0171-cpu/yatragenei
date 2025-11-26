@echo off
echo Starting YatraGenie Application...
echo.

echo Checking Python version...
python --version
if errorlevel 1 (
    echo ERROR: Python not found. Please install Python 3.8+
    pause
    exit /b 1
)

echo Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js not found. Please install Node.js 18+
    pause
    exit /b 1
)

echo.
echo Starting Backend Server...
start "YatraGenie Backend" cmd /k "cd backend && python -m venv .venv && .venv\Scripts\activate && pip install -r requirements.txt && uvicorn backend.main:app --reload --port 8000 --host 0.0.0.0"

timeout /t 5 /nobreak >nul

echo Starting Frontend Server...
start "YatraGenie Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo ========================================
echo Application starting!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to exit (servers will keep running)...
pause >nul

