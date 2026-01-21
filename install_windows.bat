@echo off
python -m venv venv
call venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install fastapi uvicorn fpdf
echo Database initializing...
python backend\database.py
pause
