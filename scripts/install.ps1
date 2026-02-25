# PowerShell script for Windows (runs in admin mode)
Write-Host "APEX Digital Installer for Windows" -ForegroundColor Green
Write-Host "This script will set up WSL2 and Ubuntu, then run the mega installer inside it."
# Ensure running as admin
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Start-Process powershell -Verb RunAs -ArgumentList "-File `"$PSCommandPath`""
    exit
}
# Enable WSL feature
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
# Download and install Ubuntu
Invoke-WebRequest -Uri https://aka.ms/wslubuntu2004 -OutFile Ubuntu.appx -UseBasicParsing
Add-AppxPackage .\Ubuntu.appx
# Launch Ubuntu and run the mega script
wsl -d Ubuntu -- bash -c "sudo apt update && sudo apt install -y git curl && git clone https://github.com/apex-digital/apex-ecommerce.git /opt/apex-ecommerce && cd /opt/apex-ecommerce && bash scripts/mega_install.sh"
Write-Host "Installation initiated in WSL. Follow the prompts there."
