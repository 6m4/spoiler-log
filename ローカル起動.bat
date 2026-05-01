@echo off
setlocal

cd /d "%~dp0"

echo === Eleventy local server ===
echo.
echo URL:
echo http://localhost:8080/spoiler-log/
echo.
echo Stop: Ctrl+C
echo.

call npm.cmd run dev

echo.
echo Server stopped.
pause
