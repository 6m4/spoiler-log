@echo off
setlocal

for /f "delims=" %%i in ('powershell -NoProfile -ExecutionPolicy Bypass -Command "([DateTimeOffset]::Now).ToString('yyyy-MM-ddTHH:mm:sszzz')"') do set "DATETEXT=%%i"
for /f "delims=" %%i in ('powershell -NoProfile -ExecutionPolicy Bypass -Command "(Get-Date).ToString('yyyy-MM-dd-HHmmss')"') do set "STAMP=%%i"

set "FILE=%~dp0%STAMP%.md"

(
echo ---
echo tags:
echo   - posts
echo date: %DATETEXT%
echo work: "blueprince"
echo ---
echo.
echo Write here.
echo.
echo ^![](/images/%STAMP%.jpg^)
echo.
echo {%% youtube "https://www.youtube.com/watch?v=xxxxxxxxxxx" %%}
) > "%FILE%"

echo Created: %FILE%
pause