@echo off
setlocal

cd /d "%~dp0"

npm.cmd run build
if errorlevel 1 goto :error

git add .
if errorlevel 1 goto :error

git commit -m "ポスト追加"
if errorlevel 1 goto :error

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