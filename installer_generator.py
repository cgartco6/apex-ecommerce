import os
from pathlib import Path

# Base folder
BASE_DIR = Path("apex-digital-ai-2")

# Folder structure
folders = [
    "database",
    "production",
    "production/https",
    "production/cron",
    "production/backup",
    "production/monitoring",
    "production/security",
    "production/migrations",
    "hybrid",
    "hybrid/payments",
    "hybrid/email",
    "hybrid/admin",
    "hybrid/governance",
    "media",
    "distribution",
    "distribution/platforms",
    "revenue",
    "launch",
]

# Files to create with default content
files = {
    "requirements.txt": "fastapi\nuvicorn\nmysql-connector-python\n",

    # Database
    "database/mysql_schema.sql": "-- MySQL schema placeholder\n",
    "database/mysql.py": "print('DB connection placeholder')\n",

    # Production
    "production/migrations/migrate.py": "print('Migration placeholder')\n",
    "production/migrations/versions.sql": "-- migration versions placeholder\n",
    "production/backup/backup.sh": "# backup script placeholder\n",
    "production/backup/restore.sh": "# restore script placeholder\n",
    "production/https/enable_https.sh": "# HTTPS script placeholder\n",
    "production/https/nginx.conf": "# Nginx config placeholder\n",
    "production/monitoring/health.py": "def status():\n    return {'status':'ok'}\n",
    "production/monitoring/metrics.py": "def metrics():\n    return {'uptime':'running'}\n",
    "production/security/rate_limit.py": "def allow(key, interval=2): return True\n",

    # Hybrid
    "hybrid/payments/payfast.py": "class PayFast:\n    def initiate(self, amount):\n        return {'gateway':'PayFast','amount':amount,'status':'initiated'}\n",
    "hybrid/payments/stripe.py": "class Stripe:\n    def initiate(self, amount):\n        return {'gateway':'Stripe','amount':amount,'status':'initiated'}\n",
    "hybrid/email/mailer.py": "class Mailer:\n    def send(self,to,sub,body):\n        print(f'Email sent to {to}')\n",
    "hybrid/admin/auth.py": "class AdminAuth:\n    def is_owner(self,user):\n        return user=='OWNER'\n",
    "hybrid/admin/dashboard.py": "class Dashboard:\n    def stats(self):\n        return {'status':'RUNNING'}\n",
    "hybrid/governance/override.py": "OVERRIDE=False\n",
    "hybrid/governance/audit.py": "print('Audit placeholder')\n",

    # Media
    "media/image_creator.py": "def create(prompt): return {'type':'image','prompt':prompt}\n",
    "media/video_creator.py": "def create(prompt): return {'type':'video','prompt':prompt}\n",
    "media/music_creator.py": "def create(prompt): return {'type':'music','prompt':prompt}\n",
    "media/voice_creator.py": "def create(text): return {'type':'voice','script':text}\n",
    "media/ad_composer.py": "def compose(offer): return {'poster':offer,'short':offer}\n",

    # Distribution
    "distribution/autoposter.py": "def post(platform, content): return {'platform':platform,'queued':True}\n",
    "distribution/scheduler.py": "def run(ad): return [post('tiktok',ad)]\n",
    "distribution/platforms/tiktok.py": "def publish(content, creds=None): return {'tiktok':'queued'}\n",
    "distribution/platforms/facebook.py": "def publish(content, creds=None): return {'facebook':'queued'}\n",
    "distribution/platforms/instagram.py": "def publish(content, creds=None): return {'instagram':'queued'}\n",
    "distribution/platforms/youtube.py": "def publish(content, creds=None): return {'youtube':'queued'}\n",

    # Revenue
    "revenue/tracker.py": "print('Revenue tracker placeholder')\n",
    "revenue/attribution.py": "print('Revenue attribution placeholder')\n",

    # Launch
    "launch/credentials.py": "print('Credentials wiring placeholder')\n",
    "launch/ad_virality.py": "print('Ad virality placeholder')\n",
    "launch/promotion_strategy.py": "print('Promotion strategy placeholder')\n",
    "launch/launch_checklist.py": "print('Launch checklist placeholder')\n",

    # Live loops
    "live.py": "print('Live loop placeholder')\n",
    "live_launch.py": "print('Live launch placeholder')\n",

    # Install & deploy scripts
    "install_windows.bat": "@echo off\n",
    "deploy_windows.bat": "@echo off\n",
    "install_ubuntu.sh": "#!/bin/bash\n",
    "deploy_ubuntu.sh": "#!/bin/bash\n",
}

def create_folders():
    for f in folders:
        dir_path = BASE_DIR / f
        dir_path.mkdir(parents=True, exist_ok=True)
        print(f"Created folder: {dir_path}")

def create_files():
    for path, content in files.items():
        file_path = BASE_DIR / path
        file_path.parent.mkdir(parents=True, exist_ok=True)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Created file: {file_path}")

def main():
    print("Starting Apex stack generator...")
    create_folders()
    create_files()
    print("✅ Apex stack populated successfully!")
    print(f"Navigate to {BASE_DIR} to continue setup.")

if __name__ == "__main__":
    main()
