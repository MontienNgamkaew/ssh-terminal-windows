@echo off
title Montien Tech Terminal - Setup
chcp 65001 > nul

echo.
echo  ============================================================
echo   Montien Tech Terminal - Windows Setup
echo  ============================================================
echo.

:: Check Node.js installation
where node > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo  [ERROR] Node.js ยังไม่ได้ติดตั้ง!
    echo.
    echo  กรุณาดาวน์โหลด Node.js จาก: https://nodejs.org
    echo  แนะนำ: LTS version เช่น Node.js 20.x หรือสูงกว่า
    echo.
    pause
    exit /b 1
)

:: Show Node.js version
for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
echo  [OK] พบ Node.js เวอร์ชัน: %NODE_VER%

:: Check npm
where npm > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo  [ERROR] npm ไม่พบในระบบ
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VER=%%i
echo  [OK] พบ npm เวอร์ชัน: %NPM_VER%
echo.

:: Install dependencies
echo  กำลังติดตั้ง dependencies...
echo  (อาจมี warning เรื่อง build tools - ไม่ต้องกังวล ยังใช้งานได้ปกติ)
echo.

npm install --loglevel=error

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo  [WARN] การติดตั้งมีปัญหาบางส่วน กำลังลองใหม่แบบ ignore-scripts...
    npm install --ignore-scripts --loglevel=error
)

echo.
echo  ============================================================
echo   Setup เสร็จสมบูรณ์!
echo   รัน start.bat เพื่อเปิดโปรแกรม
echo  ============================================================
echo.
pause
