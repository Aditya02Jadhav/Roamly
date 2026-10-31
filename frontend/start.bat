@echo off
setlocal
cd /d "%~dp0"

echo ========================================================
echo   Starting Roamly Frontend (Next.js)
echo ========================================================

REM Install dependencies if node_modules missing
if not exist "node_modules\" (
    echo [node_modules missing] Running npm install...
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
)

echo.
echo [Frontend] Starting Next.js dev server on http://localhost:3000 ...
echo.
call npm run dev

pause
