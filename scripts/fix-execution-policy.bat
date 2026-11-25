@echo off
echo ==============================================================
echo Configuring PowerShell ExecutionPolicy for CurrentUser Scope
echo ==============================================================
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force"
if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] PowerShell ExecutionPolicy set to RemoteSigned for CurrentUser.
    echo You can now run 'npm run dev' in any PowerShell terminal.
) else (
    echo.
    echo [NOTE] If administrative restrictions prevent setting policy,
    echo run '.\dev.cmd' or use 'npm.cmd run dev' directly.
)
echo.
pause
