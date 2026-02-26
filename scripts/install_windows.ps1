# PowerShell script for Windows with WSL2
Write-Host "APEX Digital Windows Installer" -ForegroundColor Green
Write-Host "This script will set up WSL2 with Ubuntu and run the mega installer."

# Check for admin rights
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Start-Process powershell -Verb RunAs -ArgumentList "-File `"$PSCommandPath`""
    exit
}

# Enable WSL
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Install Ubuntu
wsl --install -d Ubuntu

Write-Host "WSL2 and Ubuntu installed. Please reboot, then run the mega installer inside WSL:"
Write-Host "wsl ~ -e bash -c 'cd /opt && git clone https://github.com/apex-digital/apex-ecommerce.git && cd apex-ecommerce && sudo bash scripts/mega_install.sh'"
