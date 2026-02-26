#!/bin/bash
set -euo pipefail
set -euo pipefail

# =============================================================================
# APEX DIGITAL – Autonomous Agency Platform – Mega Installer
# Now with Oracle Cloud Free Tier Auto-Provisioning
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
echo -e "${GREEN}   (with Oracle Cloud Free Tier)       ${NC}"
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
# Install system dependencies (including OCI CLI and Terraform)
# -----------------------------------------------------------------------------
install_deps_linux() {
    sudo apt update
    sudo apt install -y curl wget git build-essential \
        nodejs npm python3 python3-pip python3-venv \
        nginx docker.io docker-compose \
        certbot python3-certbot-nginx
    
    # Install OCI CLI
    bash -c "$(curl -L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh)" -- --accept-all-defaults
    
    # Install Terraform
    wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg
    echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
    sudo apt update && sudo apt install -y terraform
    
    # Enable services
    sudo systemctl enable docker nginx
    sudo systemctl start docker nginx
}

install_deps_macos() {
    if ! command -v brew &> /dev/null; then
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    brew install node python3 nginx docker docker-compose terraform
    
    # Install OCI CLI
    brew install oci-cli
    
    brew services start nginx
    open /Applications/Docker.app
}

install_deps_windows() {
    echo -e "${YELLOW}On Windows, please use WSL2 with Ubuntu.${NC}"
    echo "Installing WSL2 and Ubuntu..."
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
esac

# -----------------------------------------------------------------------------
# Oracle Cloud Configuration
# -----------------------------------------------------------------------------
echo -e "${GREEN}Configuring Oracle Cloud Free Tier...${NC}"

# Check if OCI CLI is configured
if [ ! -f ~/.oci/config ]; then
    echo -e "${YELLOW}OCI CLI not configured. Let's set it up.${NC}"
    echo "Please visit: https://cloud.oracle.com"
    echo "1. Sign up for Free Tier account"
    echo "2. Generate API keys in your user profile"
    echo "3. Get your tenancy OCID and user OCID"
    echo ""
    echo "Press Enter when you have your credentials ready..."
    read
    
    oci setup config
else
    echo -e "${GREEN}OCI CLI already configured.${NC}"
fi

# Get compartment OCID
COMPARTMENT_OCID=$(oci iam compartment list --compartment-id-in-subtree true --access-level ACCESSIBLE --include-root --raw-output --query "data[?contains(\"name\",'apex')].id | [0]")

if [ -z "$COMPARTMENT_OCID" ] || [ "$COMPARTMENT_OCID" == "null" ]; then
    echo -e "${YELLOW}Creating compartment for APEX Digital...${NC}"
    COMPARTMENT_OCID=$(oci iam compartment create \
        --compartment-id $(oci iam tenancy list --query "data[0].id" --raw-output) \
        --name "apex-digital" \
        --description "APEX Digital Autonomous Platform" \
        --wait-for-state ACTIVE \
        --query "data.id" --raw-output)
fi
echo -e "${GREEN}Using compartment: $COMPARTMENT_OCID${NC}"

# -----------------------------------------------------------------------------
# Provision Free Tier Resources with Terraform
# -----------------------------------------------------------------------------
echo -e "${GREEN}Provisioning Oracle Cloud Free Tier resources...${NC}"

mkdir -p /opt/apex-ecommerce/terraform
cd /opt/apex-ecommerce/terraform

cat > main.tf <<'EOF'
terraform {
  required_providers {
    oci = {
      source = "oracle/oci"
      version = ">= 5.0.0"
    }
  }
}

variable "compartment_ocid" {
  description = "Compartment OCID"
  type        = string
}

variable "ssh_public_key" {
  description = "SSH public key for instance access"
  type        = string
  sensitive   = true
}

provider "oci" {
  region = var.region != "" ? var.region : null
}

# Get availability domains for free tier
data "oci_identity_availability_domains" "ads" {
  compartment_id = var.compartment_ocid
}

# Virtual Cloud Network
resource "oci_core_vcn" "apex_vcn" {
  compartment_id = var.compartment_ocid
  cidr_block     = "10.0.0.0/16"
  display_name   = "apex-digital-vcn"
  dns_label      = "apex"
}

# Internet Gateway
resource "oci_core_internet_gateway" "apex_igw" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.apex_vcn.id
  display_name   = "apex-internet-gateway"
  enabled        = true
}

# Route Table
resource "oci_core_route_table" "apex_route" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.apex_vcn.id
  display_name   = "apex-public-route"

  route_rules {
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_internet_gateway.apex_igw.id
  }
}

# Security List
resource "oci_core_security_list" "apex_security" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.apex_vcn.id
  display_name   = "apex-public-security"

  # SSH
  ingress_security_rules {
    protocol  = "6"
    source    = "0.0.0.0/0"
    tcp_options {
      max = 22
      min = 22
    }
  }

  # HTTP
  ingress_security_rules {
    protocol  = "6"
    source    = "0.0.0.0/0"
    tcp_options {
      max = 80
      min = 80
    }
  }

  # HTTPS
  ingress_security_rules {
    protocol  = "6"
    source    = "0.0.0.0/0"
    tcp_options {
      max = 443
      min = 443
    }
  }

  # Node.js API
  ingress_security_rules {
    protocol  = "6"
    source    = "0.0.0.0/0"
    tcp_options {
      max = 5000
      min = 5000
    }
  }

  # React Dev Server
  ingress_security_rules {
    protocol  = "6"
    source    = "0.0.0.0/0"
    tcp_options {
      max = 3000
      min = 3000
    }
  }

  # Egress: all traffic
  egress_security_rules {
    protocol    = "all"
    destination = "0.0.0.0/0"
  }
}

# Public Subnet
resource "oci_core_subnet" "apex_public" {
  compartment_id    = var.compartment_ocid
  vcn_id            = oci_core_vcn.apex_vcn.id
  cidr_block        = "10.0.1.0/24"
  display_name      = "apex-public-subnet"
  dns_label         = "public"
  security_list_ids = [oci_core_security_list.apex_security.id]
  route_table_id    = oci_core_route_table.apex_route.id
  dhcp_options_id   = oci_core_vcn.apex_vcn.default_dhcp_options_id
  prohibit_public_ip_on_vnic = false
}

# Get the latest Oracle Linux 8 image
data "oci_core_images" "ol8" {
  compartment_id           = var.compartment_ocid
  operating_system         = "Oracle Linux"
  operating_system_version = "8"
  shape                    = "VM.Standard.A1.Flex"
  sort_by                  = "TIMECREATED"
  sort_order               = "DESC"
}

# ARM Instance (4 OCPU, 24 GB RAM) - Free Tier [citation:3][citation:5]
resource "oci_core_instance" "apex_arm" {
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
  compartment_id      = var.compartment_ocid
  shape               = "VM.Standard.A1.Flex"
  display_name        = "apex-arm-main"

  shape_config {
    ocpus         = 4
    memory_in_gbs = 24
  }

  create_vnic_details {
    subnet_id        = oci_core_subnet.apex_public.id
    assign_public_ip = true
    display_name     = "apex-arm-vnic"
    hostname_label   = "apex-main"
  }

  source_details {
    source_type = "image"
    source_id   = data.oci_core_images.ol8.images[0].id
  }

  metadata = {
    ssh_authorized_keys = var.ssh_public_key
    user_data = base64encode(templatefile("${path.module}/cloud-init.sh", {}))
  }

  preserve_boot_volume = false
}

# AMD Micro Instance (1 OCPU, 1 GB RAM) - Free Tier [citation:1]
resource "oci_core_instance" "apex_micro" {
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[1].name
  compartment_id      = var.compartment_ocid
  shape               = "VM.Standard.E2.1.Micro"
  display_name        = "apex-micro-backup"

  create_vnic_details {
    subnet_id        = oci_core_subnet.apex_public.id
    assign_public_ip = true
    display_name     = "apex-micro-vnic"
    hostname_label   = "apex-micro"
  }

  source_details {
    source_type = "image"
    source_id   = data.oci_core_images.ol8.images[0].id
  }

  metadata = {
    ssh_authorized_keys = var.ssh_public_key
  }

  preserve_boot_volume = false
}

# Autonomous Database (Always Free) [citation:8]
resource "oci_database_autonomous_database" "apex_atp" {
  compartment_id           = var.compartment_ocid
  db_name                  = "apexdb"
  display_name             = "apex-digital-db"
  db_workload              = "OLTP"
  is_free_tier             = true
  license_model            = "LICENSE_INCLUDED"
  cpu_core_count           = 1
  data_storage_size_in_tbs = 0.02
  
  admin_password = random_password.atp_password.result
  
  # Configure for public internet access with SSL/TLS
  whitelisted_ips = ["0.0.0.0/0"]
}

# Generate random password for database
resource "random_password" "atp_password" {
  length  = 16
  special = true
  upper   = true
  lower   = true
  numeric = true
  min_special = 1
  override_special = "!#"
}

# Outputs
output "arm_instance_public_ip" {
  value = oci_core_instance.apex_arm.public_ip
}

output "micro_instance_public_ip" {
  value = oci_core_instance.apex_micro.public_ip
}

output "autonomous_db_name" {
  value = oci_database_autonomous_database.apex_atp.db_name
}

output "autonomous_db_password" {
  value     = random_password.atp_password.result
  sensitive = true
}

output "database_connection_strings" {
  value = oci_database_autonomous_database.apex_atp.connection_strings
  sensitive = true
}
EOF

cat > variables.tf <<'EOF'
variable "region" {
  description = "OCI Region"
  type        = string
  default     = ""
}

variable "compartment_ocid" {
  description = "Compartment OCID"
  type        = string
}

variable "ssh_public_key" {
  description = "SSH Public Key"
  type        = string
  sensitive   = true
}
EOF

cat > cloud-init.sh <<'EOF'
#!/bin/bash
# Cloud-init script for APEX Digital Platform

# Install Docker and Node.js
dnf install -y docker nodejs npm git
systemctl enable docker
systemctl start docker

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Clone repository (will be done by main script)
mkdir -p /opt/apex

# Open firewall ports
firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --permanent --add-port=443/tcp
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --permanent --add-port=5000/tcp
firewall-cmd --reload

# Create swap for memory-intensive AI operations
dd if=/dev/zero of=/swapfile bs=1M count=4096
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo "/swapfile none swap sw 0 0" >> /etc/fstab
EOF

# Generate SSH key if not exists
if [ ! -f ~/.ssh/id_rsa_apex ]; then
    ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa_apex -N "" -C "apex-digital"
fi
SSH_PUB_KEY=$(cat ~/.ssh/id_rsa_apex.pub)

# Initialize and apply Terraform
terraform init
terraform plan -var="compartment_ocid=$COMPARTMENT_OCID" -var="ssh_public_key=$SSH_PUB_KEY" -out=apex.plan
terraform apply apex.plan

# Get instance IPs
ARM_IP=$(terraform output -raw arm_instance_public_ip)
MICRO_IP=$(terraform output -raw micro_instance_public_ip)
DB_PASS=$(terraform output -raw autonomous_db_password)

echo -e "${GREEN}ARM Instance IP: $ARM_IP${NC}"
echo -e "${GREEN}Micro Instance IP: $MICRO_IP${NC}"
echo -e "${YELLOW}Database password stored securely.${NC}"

# -----------------------------------------------------------------------------
# Deploy Platform to ARM Instance
# -----------------------------------------------------------------------------
echo -e "${GREEN}Deploying APEX Digital Platform to ARM instance...${NC}"

# Wait for instance to be ready
sleep 60

# Copy repository to instance
scp -i ~/.ssh/id_rsa_apex -o StrictHostKeyChecking=no -r /opt/apex-ecommerce opc@$ARM_IP:/opt/apex/

# SSH and deploy
ssh -i ~/.ssh/id_rsa_apex -o StrictHostKeyChecking=no opc@$ARM_IP << EOF
    cd /opt/apex/apex-ecommerce
    
    # Create .env file with database credentials
    cat > server/.env << ENV_EOF
NODE_ENV=production
PORT=5000
DB_TYPE=oracle
DB_CONNECTION_STRING=$(terraform output -raw database_connection_strings | jq -r '.high')
DB_USER=ADMIN
DB_PASSWORD=$DB_PASS
JWT_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)
ENV_EOF

    # Install and build
    cd server && npm ci --only=production
    cd ../client && npm ci && npm run build
    
    # Set up PM2
    sudo npm install -g pm2
    cd ../server
    pm2 start server.js --name apex-backend
    pm2 save
    pm2 startup systemd -u opc --hp /home/opc
    
    # Configure nginx
    sudo tee /etc/nginx/conf.d/apex.conf << NGINX_EOF
server {
    listen 80;
    server_name _;
    root /opt/apex/apex-ecommerce/client/build;
    index index.html;

    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location / {
        try_files \$uri /index.html;
    }
}
NGINX_EOF

    sudo systemctl restart nginx
EOF

# -----------------------------------------------------------------------------
# Set up Autonomous Database connectivity
# -----------------------------------------------------------------------------
echo -e "${GREEN}Configuring Autonomous Database connection...${NC}"

# Download wallet from OCI
WALLET_PASS=$(openssl rand -base64 32)
oci db autonomous-database generate-wallet \
    --autonomous-database-id $(terraform output -raw autonomous_db_id) \
    --password $WALLET_PASS \
    --file /tmp/wallet.zip

# Copy wallet to instance
scp -i ~/.ssh/id_rsa_apex /tmp/wallet.zip opc@$ARM_IP:/tmp/
ssh -i ~/.ssh/id_rsa_apex opc@$ARM_IP << EOF
    sudo mkdir -p /opt/apex/wallet
    sudo unzip /tmp/wallet.zip -d /opt/apex/wallet
    sudo chown -R opc:opc /opt/apex/wallet
    
    # Configure sqlnet.ora
    sed -i "s|DIRECTORY=.*|DIRECTORY=/opt/apex/wallet|g" /opt/apex/wallet/sqlnet.ora
EOF

# -----------------------------------------------------------------------------
# Set up cron jobs on the instance
# -----------------------------------------------------------------------------
ssh -i ~/.ssh/id_rsa_apex opc@$ARM_IP << 'EOF'
    # Add cron jobs
    (crontab -l 2>/dev/null; echo "0 0 * * 0 cd /opt/apex/apex-ecommerce && npm run payout-weekly") | crontab -
    (crontab -l 2>/dev/null; echo "0 * * * * cd /opt/apex/apex-ecommerce && npm run evolve-models") | crontab -
    (crontab -l 2>/dev/null; echo "0 * * * * cd /opt/apex/apex-ecommerce && npm run schedule-posts") | crontab -
    (crontab -l 2>/dev/null; echo "*/15 * * * * cd /opt/apex/apex-ecommerce && npm run optimize-campaigns") | crontab -
    (crontab -l 2>/dev/null; echo "* * * * * cd /opt/apex/apex-ecommerce && npm run auto-scale") | crontab -
EOF

# -----------------------------------------------------------------------------
# Final output
# -----------------------------------------------------------------------------
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Installation complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "ARM Instance (Main): http://$ARM_IP"
echo -e "Micro Instance (Backup): http://$MICRO_IP"
echo -e ""
echo -e "Database:"
echo -e "  - Name: apexdb"
echo -e "  - Password: $DB_PASS"
echo -e "  - Wallet location: /opt/apex/wallet on instance"
echo -e ""
echo -e "Access the platform:"
echo -e "  - Main site: http://$ARM_IP"
echo -e "  - Owner dashboard: http://$ARM_IP/owner"
echo -e "  - SSH: ssh -i ~/.ssh/id_rsa_apex opc@$ARM_IP"
echo -e ""
echo -e "Next steps:"
echo -e "1. Update DNS to point your domain to $ARM_IP"
echo -e "2. Set up SSL with Let's Encrypt:"
echo -e "   ssh -i ~/.ssh/id_rsa_apex opc@$ARM_IP 'sudo certbot --nginx'"
echo -e "3. Configure social media API keys in server/.env"
echo -e "4. Add bank details for payouts in server/config/banks.js"
echo -e ""
echo -e "Log file: $LOG_FILE"
echo -e "${GREEN}========================================${NC}"

# After cloning, install new dependencies
cd /opt/apex-ecommerce/server
npm install axios node-cron nodemailer  # for new services

# Set up environment variables for AGI readiness
echo "USE_AGI=false" >> server/.env
echo "AGI_API_KEY=placeholder" >> server/.env

# Create necessary directories
mkdir -p server/services/ai/{core,strategic,creative,crisis,bizdev,pricing,emotional,vendor,compliance,continuous}

# Set up cron for continuous learning (every hour)
(crontab -l 2>/dev/null; echo "0 * * * * cd /opt/apex-ecommerce && npm run continuous-learn") | crontab -

# Set up cron for pricing optimization (daily)
(crontab -l 2>/dev/null; echo "0 2 * * * cd /opt/apex-ecommerce && npm run optimize-prices") | crontab -

# Set up cron for compliance checks (weekly)
(crontab -l 2>/dev/null; echo "0 3 * * 1 cd /opt/apex-ecommerce && npm run compliance-check") | crontab -

# ... (existing OS detection, dependency installation, Oracle Cloud Terraform provisioning remain) ...

# -----------------------------------------------------------------------------
# After Oracle Cloud provisioning, deploy to Afrihost cPanel (optional)
# -----------------------------------------------------------------------------
echo -e "${GREEN}Do you want to deploy the static frontend to Afrihost cPanel? (y/n)${NC}"
read -r DEPLOY_AFRIHOST
if [[ "$DEPLOY_AFRIHOST" == "y" ]]; then
  echo -e "${GREEN}Deploying to Afrihost...${NC}"
  # Use FTP or rsync to upload client/build to cPanel public_html
  # This script assumes you have FTP credentials in .env
  source /opt/apex-ecommerce/server/.env
  lftp -c "open -u $FTP_USER,$FTP_PASS $FTP_HOST; mirror -R /opt/apex-ecommerce/client/build /public_html/apex"
  
  # Set up MySQL database on cPanel (via remote MySQL or API)
  mysql -h $CPANEL_DB_HOST -u $CPANEL_DB_USER -p$CPANEL_DB_PASS < infrastructure/afrihost/cpanel_db_setup.sql
fi

# -----------------------------------------------------------------------------
# Seed database with new collections (as before) but ensure all models are created
# -----------------------------------------------------------------------------
mongosh <<EOF
use apex
// ... (existing agency, taxrates, relocation inserts) ...

// Also create default admin user if not exists
const bcrypt = require('bcryptjs');
const adminExists = db.users.findOne({ email: 'admin@apexdigital.co.za' });
if (!adminExists) {
  const hashed = bcrypt.hashSync('ChangeMe123!', 10);
  db.users.insertOne({
    name: 'Admin',
    email: 'admin@apexdigital.co.za',
    password: hashed,
    isAdmin: true,
    createdAt: new Date()
  });
}
EOF

# -----------------------------------------------------------------------------
# Set up cron for AI tasks
# -----------------------------------------------------------------------------
(crontab -l 2>/dev/null; echo "0 * * * * cd /opt/apex-ecommerce && npm run evolve-models") | crontab -
(crontab -l 2>/dev/null; echo "*/15 * * * * cd /opt/apex-ecommerce && npm run optimize-campaigns") | crontab -
(crontab -l 2>/dev/null; echo "* * * * * cd /opt/apex-ecommerce && npm run auto-scale") | crontab -

# ... (rest of the final output) ...
