@echo off
echo.
echo ========================================
echo   Novu POC - Quick Start Script
echo ========================================
echo.

REM Check if in correct directory
if not exist "server\package.json" (
    echo ERROR: Please run this script from the project root directory
    echo Expected structure:
    echo   - server/
    echo   - client/
    pause
    exit /b 1
)

echo [1/5] Checking Novu Docker containers...
docker ps | findstr novu >nul 2>&1
if errorlevel 1 (
    echo WARNING: Novu containers may not be running!
    echo Please start Novu first: cd novu/docker/community ^&^& docker-compose up -d
    echo.
    choice /C YN /M "Continue anyway?"
    if errorlevel 2 exit /b 1
)

echo [2/5] Installing server dependencies...
cd server
if not exist "node_modules" (
    echo Running npm install in server...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install server dependencies
        cd ..
        pause
        exit /b 1
    )
) else (
    echo Server dependencies already installed
)
cd ..

echo [3/5] Installing client dependencies...
cd client
if not exist "node_modules" (
    echo Running npm install in client...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install client dependencies
        cd ..
        pause
        exit /b 1
    )
) else (
    echo Client dependencies already installed
)
cd ..

echo [4/5] Checking configuration...

REM Check server .env
if not exist "server\.env" (
    echo ERROR: server/.env not found!
    echo Please copy server/.env.example to server/.env and configure
    pause
    exit /b 1
)

findstr /C:"your_novu_api_key_here" server\.env >nul 2>&1
if not errorlevel 1 (
    echo WARNING: server/.env still has placeholder values!
    echo Please update NOVU_API_KEY in server/.env
)

REM Check client .env
if not exist "client\.env" (
    echo ERROR: client/.env not found!
    echo Please copy client/.env.example to client/.env and configure
    pause
    exit /b 1
)

findstr /C:"your_novu_application_identifier_here" client\.env >nul 2>&1
if not errorlevel 1 (
    echo WARNING: client/.env still has placeholder values!
    echo Please update REACT_APP_NOVU_APP_ID in client/.env
)

echo.
echo ========================================
echo   Configuration Check Complete
echo ========================================
echo.
echo To start the application:
echo.
echo   Terminal 1: cd server ^&^& npm start
echo   Terminal 2: cd client ^&^& npm start
echo.
echo Or run:
echo   - start-server.bat (starts server only)
echo   - start-client.bat (starts client only)
echo.
echo Useful URLs:
echo   - Client:         http://localhost:3000
echo   - Server:         http://localhost:5000
echo   - Novu Dashboard: http://localhost:4200
echo.
echo Next Steps:
echo   1. Read NEXT_STEPS.md for detailed instructions
echo   2. Configure Novu workflow (identifier: task-completed)
echo   3. Start server and client
echo   4. Test with admin and user1 accounts
echo.
echo ========================================
echo.

pause
