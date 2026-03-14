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
git commit -m "ポスト追加"
if errorlevel 1 goto :error

echo.
echo === git push ===
git push
if errorlevel 1 goto :error

echo.
echo 完了しました
pause
exit /b

:error
echo.
echo エラーが発生しました
pause
exit /b 1