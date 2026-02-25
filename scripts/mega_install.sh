#!/bin/bash
set -euo pipefail

# =============================================================================
# APEX DIGITAL – Autonomous Agency Platform – Mega Installer
# Detects OS, installs dependencies, sets up environment, and deploys.
# =============================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Log file
LOG_FILE="/tmp/apex_install_$(date +%Y%m%d_%H%M%S).log"
exec > >(tee -a "$LOG_FILE") 2>&1

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   APEX DIGITAL PLATFORM INSTALLER     ${NC}"
echo -e "${GREEN}========================================${NC}"

# -----------------------------------------------------------------------------
# Detect OS
# -----------------------------------------------------------------------------
OS="unknown"
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
    else
        OS="linux"
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
    OS="windows"
else
    echo -e "${RED}Unsupported OS: $OSTYPE${NC}"
    exit 1
fi
echo -e "${GREEN}Detected OS: $OS${NC}"

# -----------------------------------------------------------------------------
# Install system dependencies
# -----------------------------------------------------------------------------
install_deps_linux() {
    sudo apt update
    sudo apt install -y curl wget git build-essential \
        nodejs npm python3 python3-pip python3-venv \
        mongodb redis-server nginx docker.io docker-compose \
        certbot python3-certbot-nginx
    sudo systemctl enable mongodb redis-server docker
    sudo systemctl start mongodb redis-server docker
}

install_deps_macos() {
    if ! command -v brew &> /dev/null; then
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    brew install node python3 mongodb redis nginx docker docker-compose
    brew services start mongodb-community redis nginx
    open /Applications/Docker.app # start Docker Desktop
}

install_deps_windows() {
    echo -e "${YELLOW}On Windows, please use WSL2 with Ubuntu.${NC}"
    echo "Installing WSL2 and Ubuntu..."
    # This requires admin PowerShell; we'll guide the user
    powershell.exe -Command "Start-Process powershell -Verb RunAs -ArgumentList 'wsl --install -d Ubuntu'"
    echo "After WSL installation, run this script again inside WSL."
    exit 0
}

case $OS in
    ubuntu|debian|linux)
        install_deps_linux
        ;;
    macos)
        install_deps_macos
        ;;
    windows)
        install_deps_windows
        ;;
    *)
        echo -e "${RED}Unsupported OS: $OS${NC}"
        exit 1
        ;;
esac

# -----------------------------------------------------------------------------
# Clone repository (if not already present)
# -----------------------------------------------------------------------------
REPO_URL="https://github.com/apex-digital/apex-ecommerce.git"
INSTALL_DIR="/opt/apex-ecommerce"

if [ ! -d "$INSTALL_DIR" ]; then
    echo -e "${GREEN}Cloning repository...${NC}"
    sudo mkdir -p /opt
    sudo chown $USER:$USER /opt
    git clone "$REPO_URL" "$INSTALL_DIR"
else
    echo -e "${YELLOW}Repository already exists at $INSTALL_DIR. Pulling latest...${NC}"
    cd "$INSTALL_DIR"
    git pull
fi
cd "$INSTALL_DIR"

# -----------------------------------------------------------------------------
# Set up environment variables
# -----------------------------------------------------------------------------
echo -e "${GREEN}Configuring environment...${NC}"
if [ ! -f server/.env ]; then
    cp server/.env.example server/.env
    # Generate JWT secret
    JWT_SECRET=$(openssl rand -base64 32)
    sed -i.bak "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" server/.env
    # Generate encryption key for payments
    ENC_KEY=$(openssl rand -hex 32)
    sed -i.bak "s|ENCRYPTION_KEY=.*|ENCRYPTION_KEY=$ENC_KEY|" server/.env
    # Set database URI
    sed -i.bak "s|MONGO_URI=.*|MONGO_URI=mongodb://localhost:27017/apex|" server/.env
    echo -e "${GREEN}Environment file created at server/.env${NC}"
else
    echo -e "${YELLOW}server/.env already exists. Skipping.${NC}"
fi

# -----------------------------------------------------------------------------
# Install backend dependencies
# -----------------------------------------------------------------------------
echo -e "${GREEN}Installing backend dependencies...${NC}"
cd "$INSTALL_DIR/server"
npm ci --only=production

# -----------------------------------------------------------------------------
# Install frontend dependencies and build
# -----------------------------------------------------------------------------
echo -e "${GREEN}Installing frontend dependencies and building...${NC}"
cd "$INSTALL_DIR/client"
npm ci
npm run build

# -----------------------------------------------------------------------------
# Initialize database
# -----------------------------------------------------------------------------
echo -e "${GREEN}Initializing database...${NC}"
cd "$INSTALL_DIR"
if [ -f scripts/init_db.js ]; then
    node scripts/init_db.js
else
    echo -e "${YELLOW}No init_db.js found. Skipping database initialization.${NC}"
fi

# -----------------------------------------------------------------------------
# Set up PM2 for process management (if not already)
# -----------------------------------------------------------------------------
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi

# Start backend with PM2
cd "$INSTALL_DIR/server"
pm2 delete apex-backend 2>/dev/null || true
pm2 start server.js --name apex-backend --env production
pm2 save
pm2 startup systemd -u $USER --hp /home/$USER

# Serve frontend with nginx (Linux/macOS) or use serve (Windows)
if [[ "$OS" == "ubuntu" || "$OS" == "debian" || "$OS" == "linux" || "$OS" == "macos" ]]; then
    # Configure nginx
    sudo cp "$INSTALL_DIR/infrastructure/nginx/apex.conf" /etc/nginx/sites-available/apex
    sudo ln -sf /etc/nginx/sites-available/apex /etc/nginx/sites-enabled/
    sudo nginx -t && sudo systemctl reload nginx
elif [[ "$OS" == "windows" ]]; then
    # Use serve to serve static files
    npm install -g serve
    serve -s "$INSTALL_DIR/client/build" -l 3000 &
fi

# -----------------------------------------------------------------------------
# Set up cron jobs
# -----------------------------------------------------------------------------
echo -e "${GREEN}Setting up cron jobs...${NC}"
# Backup current crontab
crontab -l > /tmp/cron_backup_$$ 2>/dev/null || true

# Add our jobs if not already present
grep -q "payout-weekly" /tmp/cron_backup_$$ || echo "0 0 * * 0 cd $INSTALL_DIR && npm run payout-weekly" >> /tmp/cron_backup_$$
grep -q "evolve-models" /tmp/cron_backup_$$ || echo "0 * * * * cd $INSTALL_DIR && npm run evolve-models" >> /tmp/cron_backup_$$
grep -q "schedule-posts" /tmp/cron_backup_$$ || echo "0 * * * * cd $INSTALL_DIR && npm run schedule-posts" >> /tmp/cron_backup_$$
grep -q "optimize-campaigns" /tmp/cron_backup_$$ || echo "*/15 * * * * cd $INSTALL_DIR && npm run optimize-campaigns" >> /tmp/cron_backup_$$
grep -q "auto-scale" /tmp/cron_backup_$$ || echo "* * * * * cd $INSTALL_DIR && npm run auto-scale" >> /tmp/cron_backup_$$

crontab /tmp/cron_backup_$$
rm /tmp/cron_backup_$$

# -----------------------------------------------------------------------------
# Final steps
# -----------------------------------------------------------------------------
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Installation complete!${NC}"
echo -e "Log file: $LOG_FILE"
echo -e "Access the platform at: http://localhost"
echo -e "Owner dashboard: http://localhost/owner"
echo -e ""
echo -e "Next steps:"
echo -e "1. Edit server/.env with your actual API keys (social media, payment gateways)."
echo -e "2. Add your bank details for payouts in server/config/banks.js"
echo -e "3. Replace placeholder colours in client/src/assets/styles/global.css with actual apex-digital.co.za values."
echo -e "4. Restart services: pm2 restart all"
echo -e "5. Monitor logs: pm2 logs"
echo -e "${GREEN}========================================${NC}"
