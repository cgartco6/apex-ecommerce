#!/bin/bash
sudo apt update && sudo apt install -y python3 python3-venv python3-pip
python3 -m venv venv
source venv/bin/activate
python3 -m pip install --upgrade pip
pip install fastapi uvicorn fpdf
echo "Database initializing..."
python3 backend/database.py
echo "Installation complete!"
