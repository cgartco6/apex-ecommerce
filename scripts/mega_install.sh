#!/bin/bash
set -e

echo "Detecting OS..."
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$NAME
    else
        OS="Linux"
    fi
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS="Windows"
else
    echo "Unsupported OS"
    exit 1
fi

echo "OS detected: $OS"

# Install common dependencies
if [[ "$OS" == "Ubuntu"* ]]; then
    sudo apt update
    sudo apt install -y nodejs npm mongodb nginx python3 python3-pip docker.io docker-compose
    sudo systemctl enable mongodb
elif [[ "$OS" == "Windows"* ]]; then
    # Use Chocolatey or Winget
    echo "Please install manually: Node.js, MongoDB, Python, Docker Desktop"
    # Could use winget install
fi

# Clone repository (assumes script is inside repo, else clone)
cd /opt
if [ ! -d apex-ecommerce ]; then
    git clone https://github.com/yourrepo/apex-ecommerce.git
fi
cd apex-ecommerce

# Install backend
cd server
npm install
# Set up environment file
cp .env.example .env
# Generate secrets, etc.

# Install frontend
cd ../client
npm install
npm run build

# Set up database
mongo < scripts/init_db.js

# Start services with Docker Compose
cd ..
docker-compose up -d

# Configure nginx (if on Ubuntu)
sudo cp infrastructure/nginx/apex.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/apex.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo "Installation complete. Access at http://localhost"
