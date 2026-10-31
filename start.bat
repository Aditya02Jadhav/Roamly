@echo off
setlocal
cd /d "%~dp0"

echo ========================================================
echo   Launching Roamly Full Stack (Backend + Frontend)
echo ========================================================
echo.

echo [1/2] Starting Backend in new window...
start "Roamly Backend API" cmd /k "cd /d "%~dp0backend" && call start.bat"

echo [2/2] Starting Frontend in new window...
start "Roamly Frontend App" cmd /k "cd /d "%~dp0frontend" && call start.bat"

echo.
echo ========================================================
echo   Servers running:
echo   - Backend:  http://localhost:8000 (Docs: /docs)
echo   - Frontend: http://localhost:3000
echo ========================================================
