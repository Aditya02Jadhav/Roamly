@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ========================================================
echo   Building Roamly Full Stack (Backend + Frontend)
echo ========================================================
echo.

echo [1/2] Building Backend...
if not exist "backend\.venv\Scripts\python.exe" (
    echo [.venv missing] Creating virtual environment...
    set "PY_CMD="
    where python >nul 2>&1
    if not errorlevel 1 set "PY_CMD=python"
    if not defined PY_CMD (
        where py >nul 2>&1
        if not errorlevel 1 set "PY_CMD=py"
    )
    if not defined PY_CMD (
        echo [ERROR] Neither 'python' nor 'py' launcher found on PATH.
        goto :fail
    )
    !PY_CMD! -m venv backend\.venv
    if errorlevel 1 (
        echo [ERROR] Failed to create .venv.
        goto :fail
    )
)

echo [Dependencies] Installing requirements...
backend\.venv\Scripts\pip.exe install -r backend\requirements.txt
if errorlevel 1 (
    echo [ERROR] pip install failed.
    goto :fail
)

echo [Compile] Checking Python sources...
backend\.venv\Scripts\python.exe -m compileall -q backend\app
if errorlevel 1 (
    echo [ERROR] Python compile check failed.
    goto :fail
)
echo [OK] Backend build complete.
echo.

echo [2/2] Building Frontend...
if not exist "frontend\node_modules\" (
    echo [node_modules missing] Running npm install...
    pushd frontend
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed.
        popd
        goto :fail
    )
    popd
)

pushd frontend
call npm run build
if errorlevel 1 (
    echo [ERROR] Frontend build failed.
    popd
    goto :fail
)
popd
echo [OK] Frontend build complete.
echo.

echo ========================================================
echo   Build succeeded: backend + frontend
echo ========================================================
pause
exit /b 0

:fail
echo.
echo ========================================================
echo   Build FAILED. See errors above.
echo ========================================================
pause
exit /b 1
