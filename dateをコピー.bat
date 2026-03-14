@echo off
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$tz = [System.TimeZoneInfo]::FindSystemTimeZoneById('Tokyo Standard Time');" ^
  "$now = [System.TimeZoneInfo]::ConvertTimeFromUtc([datetime]::UtcNow, $tz);" ^
  "$text = 'date: ' + $now.ToString('yyyy-MM-ddTHH:mm:ss') + '+09:00';" ^
  "Set-Clipboard -Value $text"