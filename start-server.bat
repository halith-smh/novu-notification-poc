@echo off
echo.
echo ========================================
echo   Starting Novu POC Server...
echo ========================================
echo.

cd server

if not exist "node_modules" (
    echo Installing dependencies first...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
)

echo Starting Express server on port 5000...
echo.
call npm start
