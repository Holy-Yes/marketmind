@echo off
echo ============================================
echo   MarketMind — Starting Backend Server
echo ============================================

cd /d "%~dp0backend"

echo Checking for virtual environment...
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies from requirements.txt...
pip install -r requirements.txt

echo.
echo Starting FastAPI server at http://localhost:8000
echo API Docs at http://localhost:8000/docs
echo.
uvicorn main:app --reload --port 8000 --host 0.0.0.0

pause
