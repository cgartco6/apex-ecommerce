#!/bin/bash
source venv/bin/activate
echo "Starting Apex E-Commerce..."
uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload
