@echo off
echo.
echo ========================================
echo   Starting Novu POC Client...
echo ========================================
echo.

cd client

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

echo Starting React development server...
echo Browser will open automatically at http://localhost:3000
echo.
call npm start
