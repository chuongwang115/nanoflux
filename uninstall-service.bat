@echo off
setlocal EnableExtensions

cd /d "%~dp0"
set "SERVICE_NAME=NanoFlux"
set "NSSM_EXE=%CD%\tools\nssm\nssm.exe"

net session >nul 2>&1
if errorlevel 1 (
    echo.
    echo ========================================
    echo   Uninstall NanoFlux Windows Service
    echo ========================================
    echo.
    echo This will stop and remove the NanoFlux Windows service.
    echo The program will no longer start automatically on boot.
    echo.
    echo   Service name: %SERVICE_NAME%
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
    echo   Uninstall NanoFlux Windows Service
    echo ========================================
    echo.
    echo This will stop and remove the NanoFlux Windows service.
    echo The program will no longer start automatically on boot.
    echo.
    echo   Service name: %SERVICE_NAME%
    echo.
    echo Press any key to continue...
    pause >nul
    echo.
)

echo.
echo ========================================
echo   Uninstall NanoFlux Windows Service
echo ========================================
echo.

sc query "%SERVICE_NAME%" >nul 2>&1
if errorlevel 1 (
    echo Service "%SERVICE_NAME%" is not installed.
    pause
    exit /b 0
)

echo Stopping service...
net stop "%SERVICE_NAME%" >nul 2>&1
timeout /t 3 /nobreak >nul

if exist "%NSSM_EXE%" (
    "%NSSM_EXE%" remove "%SERVICE_NAME%" confirm
) else (
    sc delete "%SERVICE_NAME%"
)

if errorlevel 1 (
    echo [ERROR] Failed to remove service.
    pause
    exit /b 1
)

echo.
echo Service "%SERVICE_NAME%" removed.
echo.
pause
exit /b 0
