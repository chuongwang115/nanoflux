@echo off
setlocal EnableExtensions EnableDelayedExpansion

cd /d "%~dp0"
set "WORKDIR=%CD%"
set "SERVICE_NAME=NanoFlux"
set "NSSM_DIR=%WORKDIR%\tools\nssm"
set "NSSM_EXE=%NSSM_DIR%\nssm.exe"
set "LOG_DIR=%WORKDIR%\logs"

set "PORT=3000"
if exist ".env" for /f "usebackq eol=# tokens=1,* delims==" %%a in (".env") do (
    if /i "%%~a"=="PORT" if not "%%~b"=="" set "PORT=%%~b"
)

:: Require administrator
net session >nul 2>&1
if errorlevel 1 (
    echo.
    echo ========================================
    echo   Install NanoFlux Windows Service
    echo ========================================
    echo.
    echo This will register NanoFlux as a Windows service
    echo and set it to start automatically on boot.
    echo.
    echo   Service name: %SERVICE_NAME%
    echo   URL:          http://localhost:%PORT%/
    echo   Logs:         %LOG_DIR%
    echo.
    echo Administrator privileges are required.
    echo.
    echo Press any key to continue...
    pause >nul
    echo.
    echo Requesting administrator privileges...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -ArgumentList '/elevated' -Verb RunAs"
    exit /b 0
)

if /i not "%~1"=="/elevated" (
    echo.
    echo ========================================
    echo   Install NanoFlux Windows Service
    echo ========================================
    echo.
    echo This will register NanoFlux as a Windows service
    echo and set it to start automatically on boot.
    echo.
    echo   Service name: %SERVICE_NAME%
    echo   URL:          http://localhost:%PORT%/
    echo   Logs:         %LOG_DIR%
    echo.
    echo Press any key to continue...
    pause >nul
    echo.
)

echo.
echo ========================================
echo   Install NanoFlux Windows Service
echo ========================================
echo.

call :FindBun
if errorlevel 1 exit /b 1

if not exist "node_modules\" (
    echo Installing dependencies...
    "%BUN_CMD%" install
    if errorlevel 1 (
        echo [ERROR] bun install failed.
        pause
        exit /b 1
    )
    echo.
)

echo Building frontend (one-time before service install)...
"%BUN_CMD%" run build:web
if errorlevel 1 (
    echo [ERROR] build:web failed.
    pause
    exit /b 1
)
echo.

call :EnsureNssm
if errorlevel 1 exit /b 1

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

sc query "%SERVICE_NAME%" >nul 2>&1
if not errorlevel 1 (
    echo Stopping existing service...
    net stop "%SERVICE_NAME%" >nul 2>&1
    timeout /t 3 /nobreak >nul
    "%NSSM_EXE%" remove "%SERVICE_NAME%" confirm >nul 2>&1
)

echo Registering service "%SERVICE_NAME%"...
"%NSSM_EXE%" install "%SERVICE_NAME%" "%BUN_CMD%" "run start:service"
if errorlevel 1 (
    echo [ERROR] Failed to register service.
    pause
    exit /b 1
)

"%NSSM_EXE%" set "%SERVICE_NAME%" AppDirectory "%WORKDIR%"
"%NSSM_EXE%" set "%SERVICE_NAME%" DisplayName "NanoFlux"
"%NSSM_EXE%" set "%SERVICE_NAME%" Description "NanoFlux RSS reader - auto-start web server"
"%NSSM_EXE%" set "%SERVICE_NAME%" Start SERVICE_AUTO_START
"%NSSM_EXE%" set "%SERVICE_NAME%" AppStdout "%LOG_DIR%\service-stdout.log"
"%NSSM_EXE%" set "%SERVICE_NAME%" AppStderr "%LOG_DIR%\service-stderr.log"
"%NSSM_EXE%" set "%SERVICE_NAME%" AppRotateFiles 1
"%NSSM_EXE%" set "%SERVICE_NAME%" AppRotateBytes 10485760
"%NSSM_EXE%" set "%SERVICE_NAME%" AppExit Default Restart
"%NSSM_EXE%" set "%SERVICE_NAME%" AppRestartDelay 5000

echo Starting service...
net start "%SERVICE_NAME%"
if errorlevel 1 (
    echo [ERROR] Service failed to start. Check logs in %LOG_DIR%
    pause
    exit /b 1
)

set "PORT=3000"
if exist ".env" for /f "usebackq eol=# tokens=1,* delims==" %%a in (".env") do (
    if /i "%%~a"=="PORT" if not "%%~b"=="" set "PORT=%%~b"
)

echo Waiting for server, then opening browser...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$p=%PORT%; $u='http://localhost:'+$p+'/'; $deadline=(Get-Date).AddMinutes(2); while((Get-Date) -lt $deadline){try{$t=New-Object Net.Sockets.TcpClient;$t.Connect('127.0.0.1',[int]$p);$t.Close();Start-Process $u;exit 0}catch{Start-Sleep -Milliseconds 500}}; Write-Host '[WARN] Server not ready in time. Open manually:' $u; exit 1"

echo.
echo ========================================
echo   NanoFlux service installed
echo   Name:    %SERVICE_NAME%
echo   URL:     http://localhost:%PORT%/
echo   Logs:    %LOG_DIR%
echo   Manage:  services.msc
echo ========================================
echo.
pause
exit /b 0

:FindBun
set "BUN_CMD="
where bun >nul 2>&1 && set "BUN_CMD=bun"
if not defined BUN_CMD if exist "%USERPROFILE%\.bun\bin\bun.exe" set "BUN_CMD=%USERPROFILE%\.bun\bin\bun.exe"
if not defined BUN_CMD if exist "%LOCALAPPDATA%\bun\bin\bun.exe" set "BUN_CMD=%LOCALAPPDATA%\bun\bin\bun.exe"
if not defined BUN_CMD (
    echo [ERROR] Bun not found in PATH.
    echo Install: powershell -c "irm bun.sh/install.ps1 ^| iex"
    pause
    exit /b 1
)
exit /b 0

:EnsureNssm
if exist "%NSSM_EXE%" exit /b 0

echo Downloading NSSM (service wrapper)...
if not exist "%NSSM_DIR%" mkdir "%NSSM_DIR%"

set "NSSM_ZIP=%TEMP%\nssm-2.24.zip"
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$ErrorActionPreference='Stop';" ^
    "Invoke-WebRequest -Uri 'https://nssm.cc/release/nssm-2.24.zip' -OutFile '%NSSM_ZIP%';" ^
    "Expand-Archive -Path '%NSSM_ZIP%' -DestinationPath '%TEMP%\nssm-extract' -Force;" ^
    "Copy-Item -Path '%TEMP%\nssm-extract\nssm-2.24\win64\nssm.exe' -Destination '%NSSM_EXE%' -Force;" ^
    "Remove-Item -Path '%NSSM_ZIP%' -Force -ErrorAction SilentlyContinue;" ^
    "Remove-Item -Path '%TEMP%\nssm-extract' -Recurse -Force -ErrorAction SilentlyContinue"

if not exist "%NSSM_EXE%" (
    echo [ERROR] Failed to download NSSM.
    echo You can install manually: winget install NSSM.NSSM
    pause
    exit /b 1
)
exit /b 0
