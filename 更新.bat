@echo off
setlocal

cd /d "%~dp0"

echo === npm build ===
call npm.cmd run build
if errorlevel 1 goto :error

echo.
echo === git add ===
git add .
if errorlevel 1 goto :error

echo.
echo === git commit ===
git commit -m "post add"
if errorlevel 1 goto :error

echo.
echo === git push ===
git push
if errorlevel 1 goto :error

echo.
echo Done
pause
exit /b

:error
echo.
echo Error
pause
exit /b 1