@echo off
setlocal EnableExtensions EnableDelayedExpansion

cd /d "%~dp0"
set "SERVICE_NAME=NanoFlux"

sc query "%SERVICE_NAME%" >nul 2>&1
if not errorlevel 1 (
    for /f "tokens=3" %%s in ('sc query "%SERVICE_NAME%" ^| findstr /i "STATE"') do set "SVC_STATE=%%s"
    if "!SVC_STATE!"=="RUNNING" (
        echo Stopping Windows service %SERVICE_NAME%...
        net stop "%SERVICE_NAME%" >nul 2>&1
        if not errorlevel 1 (
            echo Stopped NanoFlux service.
            pause
            exit /b 0
        )
    )
)

call "%~dp0scripts\read-env-port.bat"
if errorlevel 1 (
    pause
    exit /b 1
)

set "FOUND=0"
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":%PORT% " ^| findstr LISTENING') do (
    set "FOUND=1"
    taskkill /F /PID %%p >nul 2>&1
)

if "%FOUND%"=="0" (
    echo No process listening on port %PORT%.
) else (
    echo Stopped NanoFlux on port %PORT%.
)

pause
