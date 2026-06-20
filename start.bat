@echo off
title Montien Tech Terminal
chcp 65001 > nul

:: Check node_modules exists
if not exist "node_modules\" (
    echo  [ERROR] ยังไม่ได้ติดตั้ง dependencies!
    echo  กรุณารัน setup.bat ก่อน
    echo.
    pause
    exit /b 1
)

echo.
echo  ============================================================
echo   Montien Tech Terminal
echo   URL: http://localhost:3000
echo   กด Ctrl+C เพื่อหยุด Server
echo  ============================================================
echo.

:: Open browser after 2 second delay (background task)
start /min "" cmd /c "ping -n 3 127.0.0.1 >nul 2>&1 && start "" http://localhost:3000"

:: Start the server
node server.js

echo.
echo  Server หยุดทำงานแล้ว
pause
