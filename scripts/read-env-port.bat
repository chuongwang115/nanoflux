@echo off
cd /d "%~dp0.."
set "PORT="
for %%f in (.env .env.example) do (
  if not defined PORT if exist "%%f" (
    for /f "usebackq eol=# tokens=1,* delims==" %%a in ("%%f") do (
      if /i "%%~a"=="PORT" if not "%%~b"=="" set "PORT=%%~b"
    )
  )
)
if not defined PORT (
  echo [ERROR] PORT not set in .env or .env.example >&2
  exit /b 1
)
exit /b 0
