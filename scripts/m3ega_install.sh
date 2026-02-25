#!/bin/bash
set -e

echo "=== APEX DIGITAL PLATFORM INSTALLER ==="

# Detect OS
OS="$(uname -s)"
case "$OS" in
  Linux*)     MACHINE=Linux;;
  Darwin*)    MACHINE=Mac;;
  CYGWIN*|MINGW*|MSYS*) MACHINE=Windows;;
  *)          MACHINE="UNKNOWN"
esac

if [ "$MACHINE" = "UNKNOWN" ]; then
  echo "Unsupported OS"
  exit 1
fi
echo "Detected: $MACHINE"

# Install common tools (Node.js, Python, Docker, etc.)
if [ "$MACHINE" = "Linux" ]; then
  sudo apt update
  sudo apt install -y nodejs npm python3 python3-pip docker.io docker-compose mongodb nginx redis
  sudo systemctl enable mongodb docker
elif [ "$MACHINE" = "Mac" ]; then
  brew install node python3 docker docker-compose mongodb redis nginx
elif [ "$MACHINE" = "Windows" ]; then
  echo "Please install manually: Node.js, Python, Docker Desktop, MongoDB, Redis"
  echo "Or use WSL2 and run this script inside Ubuntu"
  exit 1
fi

# Clone repository
cd /opt
if [ ! -d apex-ecommerce ]; then
  git clone https://github.com/apex-digital/apex-ecommerce.git
fi
cd apex-ecommerce

# Set up environment
cp server/.env.example server/.env
# Generate secrets
SECRET=$(openssl rand -base64 32)
sed -i "s/JWT_SECRET=.*/JWT_SECRET=$SECRET/" server/.env

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build

# Database setup
mongo < scripts/init_db.js

# Start services with Docker Compose
cd ..
docker-compose up -d

# Configure cron for payouts
(crontab -l 2>/dev/null; echo "0 0 * * 0 cd /opt/apex-ecommerce && npm run payout-weekly") | crontab -

# Configure cron for self‑evolution (hourly model check)
(crontab -l 2>/dev/null; echo "0 * * * * cd /opt/apex-ecommerce && npm run evolve-models") | crontab -

# Nginx config
if [ "$MACHINE" = "Linux" ]; then
  sudo cp infrastructure/nginx/apex.conf /etc/nginx/sites-available/
  sudo ln -sf /etc/nginx/sites-available/apex.conf /etc/nginx/sites-enabled/
  sudo nginx -t && sudo systemctl reload nginx
fi

echo "Installation complete! Access at http://localhost"
echo "Owner dashboard: http://localhost/payouts"

# Add cron for marketing engine scheduler
(crontab -l 2>/dev/null; echo "0 * * * * cd /opt/apex-ecommerce && npm run schedule-posts") | crontab -
# Add cron for target AI optimisation (every 15 minutes)
(crontab -l 2>/dev/null; echo "*/15 * * * * cd /opt/apex-ecommerce && npm run optimize-campaigns") | crontab -
# Add cron for auto‑scaler (every minute)
(crontab -l 2>/dev/null; echo "* * * * * cd /opt/apex-ecommerce && npm run auto-scale") | crontab -
