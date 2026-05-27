@echo off
setlocal EnableExtensions

cd /d "%~dp0"
set "WORKDIR=%CD%"

set "BUN_CMD="
where bun >nul 2>&1 && set "BUN_CMD=bun"
if not defined BUN_CMD if exist "%USERPROFILE%\.bun\bin\bun.exe" set "BUN_CMD=%USERPROFILE%\.bun\bin\bun.exe"
if not defined BUN_CMD if exist "%LOCALAPPDATA%\bun\bin\bun.exe" set "BUN_CMD=%LOCALAPPDATA%\bun\bin\bun.exe"

if not defined BUN_CMD (
    echo [ERROR] Bun not found in PATH.
    echo Install: powershell -c "irm bun.sh/install.ps1 ^| iex"
    echo Then reopen this window and try again.
    pause
    exit /b 1
)

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

call "%~dp0scripts\read-env-port.bat"
if errorlevel 1 (
    pause
    exit /b 1
)

echo.
echo ========================================
echo   About to start NanoFlux (background)
echo   Browser: http://localhost:%PORT%/
echo ========================================
echo.
echo Press any key to continue...
pause >nul
echo.

powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -Command "Start-Process -FilePath '%BUN_CMD%' -ArgumentList 'run','start' -WorkingDirectory '%WORKDIR%' -WindowStyle Hidden; $p=%PORT%; $u='http://localhost:'+$p+'/'; $deadline=(Get-Date).AddMinutes(2); while((Get-Date) -lt $deadline){try{$t=New-Object Net.Sockets.TcpClient;$t.Connect('127.0.0.1',$p);$t.Close();Start-Process $u;break}catch{Start-Sleep -Milliseconds 500}}"

echo NanoFlux is running. This window will close shortly.
ping -n 3 127.0.0.1 >nul

endlocal
exit /b 0
