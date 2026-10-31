@echo off
setlocal
cd /d "%~dp0"

echo ========================================================
echo   Starting Roamly Backend API
echo ========================================================

REM Locate Python executable if .venv missing
if not exist ".venv\Scripts\python.exe" (
    echo [.venv missing] Creating virtual environment...
    set "PY_CMD=python"
    where python >nul 2>&1
    if errorlevel 1 (
        where py >nul 2>&1
        if not errorlevel 1 (
            set "PY_CMD=py"
        ) else (
            echo [ERROR] Neither 'python' nor 'py' launcher found on PATH.
            pause
            exit /b 1
        )
    )
    %PY_CMD% -m venv .venv
    if errorlevel 1 (
        echo [ERROR] Failed to create .venv.
        pause
        exit /b 1
    )
    echo [Dependencies] Installing requirements...
    .\.venv\Scripts\pip.exe install -r requirements.txt
)

REM Check if .env exists
if not exist ".env" (
    echo [.env missing] Copying from .env.example...
    copy .env.example .env
)

REM Run database migrations
echo [Database] Applying Alembic migrations...
.\.venv\Scripts\alembic.exe upgrade head
if errorlevel 1 (
    echo [WARNING] Alembic upgrade encountered an issue. Ensure PostgreSQL is running.
)

REM Start server
echo.
echo [Server] Starting FastAPI on http://localhost:8000 ...
echo [Docs] OpenAPI docs at http://localhost:8000/docs
echo.
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause
