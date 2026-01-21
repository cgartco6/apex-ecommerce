@echo off
call venv\Scripts\activate.bat
echo Starting Apex E-Commerce...
uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload
pause
