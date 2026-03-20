@echo off
setlocal

rem 投稿先の作品slugをここだけ変える
rem 作品追加はD:\ネタバレ保管庫\src\_data\works.jsonを修正
set "WORK_SLUG=livealive"

for /f "delims=" %%i in ('powershell -NoProfile -ExecutionPolicy Bypass -Command "([DateTimeOffset]::Now).ToString('yyyy-MM-ddTHH:mm:sszzz')"') do set "DATETEXT=%%i"
for /f "delims=" %%i in ('powershell -NoProfile -ExecutionPolicy Bypass -Command "(Get-Date).ToString('yyyy-MM-dd-HHmmss')"') do set "STAMP=%%i"

set "OUTDIR=%~dp0src\posts"
set "BASENAME=%STAMP%-%WORK_SLUG%"
set "FILE=%OUTDIR%\%BASENAME%.md"

if not exist "%OUTDIR%" mkdir "%OUTDIR%"

(
echo ---
echo tags:
echo   - posts
echo date: %DATETEXT%
echo work: "%WORK_SLUG%"
echo ---
echo.
echo Write here.
echo.
echo ^![](/images/%BASENAME%.jpg^)
echo.
echo ^<!-- {%% youtube "https://www.youtube.com/watch?v=xxxxxxxxxxx" %%} --^>
) > "%FILE%"

if not exist "%~dp0src\images" mkdir "%~dp0src\images"

echo Created: %FILE%
start "" "%FILE%"
start "" "%~dp0src\images"