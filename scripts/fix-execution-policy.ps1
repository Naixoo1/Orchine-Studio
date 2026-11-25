<#
.SYNOPSIS
    Fixes PowerShell ExecutionPolicy for running npm on Windows.
.DESCRIPTION
    Sets the PowerShell ExecutionPolicy for the CurrentUser scope to RemoteSigned.
    This does not require Administrator privileges and resolves PSSecurityException with npm.ps1.
#>

[CmdletBinding()]
param ()

Write-Host "Checking current PowerShell execution policy..." -ForegroundColor Cyan
$currentPolicy = Get-ExecutionPolicy
Write-Host "Current effective ExecutionPolicy: $currentPolicy"

if ($currentPolicy -in @("RemoteSigned", "Unrestricted", "Bypass")) {
    Write-Host "ExecutionPolicy is already configured to allow scripts ($currentPolicy)." -ForegroundColor Green
    Write-Host "You can run 'npm run dev' without restriction." -ForegroundColor Green
} else {
    try {
        Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
        Write-Host "ExecutionPolicy successfully updated to RemoteSigned for CurrentUser." -ForegroundColor Green
        Write-Host "You can now run 'npm run dev' without script execution errors." -ForegroundColor Green
    } catch {
        Write-Warning "Could not update CurrentUser registry policy: $_"
        Write-Host "Alternative options:" -ForegroundColor Yellow
        Write-Host "1. Use 'npm.cmd run dev' directly." -ForegroundColor Yellow
        Write-Host "2. Use the project runner '.\dev.cmd'." -ForegroundColor Yellow
        Write-Host "3. Open terminal in VS Code (auto-configured with ExecutionPolicy Bypass)." -ForegroundColor Yellow
    }
}
