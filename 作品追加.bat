@echo off
setlocal

cd /d "%~dp0"

echo === Add work ===
echo.
echo Work slug: lowercase letters, numbers, and hyphens only.
echo Example: livealive
echo.

node scripts\add-work.js
if errorlevel 1 goto :error

echo.
echo Opening card image folder...
start "" "%~dp0src\images\cards"

echo.
echo Done
pause
exit /b

:error
echo.
echo Error
pause
exit /b 1
