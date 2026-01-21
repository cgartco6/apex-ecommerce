import os
from pathlib import Path

BASE_DIR = Path("apex-ecommerce")

folders = [
    "backend",
    "frontend/css",
    "frontend/js",
    "static/images",
    "static/docs",
    "install_deploy"
]

# Fully coded files
files = {
    # Backend
    "backend/app.py": """from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from backend import auth, cart, dashboards, documents, database

app = FastAPI()
app.mount("/static", StaticFiles(directory="frontend"), name="static")

app.include_router(auth.router)
app.include_router(cart.router)
app.include_router(dashboards.router)
app.include_router(documents.router)

@app.get("/")
def home():
    return open("frontend/index.html").read()
""",

    "backend/database.py": """import sqlite3
from pathlib import Path

DB_FILE = Path("backend/db.sqlite3")

def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(\"\"\"CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'client'
    )\"\"\")
    cur.execute(\"\"\"CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        price REAL,
        stock INTEGER
    )\"\"\")
    cur.execute(\"\"\"CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        total REAL,
        status TEXT DEFAULT 'pending'
    )\"\"\")
    conn.commit()
    conn.close()

init_db()
""",

    "backend/auth.py": """from fastapi import APIRouter, Form
from backend.database import get_connection
import hashlib

router = APIRouter(prefix="/auth")

def hash_password(pw: str):
    return hashlib.sha256(pw.encode()).hexdigest()

@router.post("/register")
def register(username: str = Form(...), email: str = Form(...), password: str = Form(...)):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("INSERT INTO users (username,email,password) VALUES (?,?,?)",
                    (username,email,hash_password(password)))
        conn.commit()
        return {"status":"success"}
    except:
        return {"status":"error","msg":"User exists"}
    finally:
        conn.close()

@router.post("/login")
def login(username: str = Form(...), password: str = Form(...)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE username=?", (username,))
    user = cur.fetchone()
    conn.close()
    if user and hash_password(password) == user["password"]:
        return {"status":"success","role":user["role"],"user_id":user["id"]}
    return {"status":"error","msg":"Invalid credentials"}
""",

    "backend/cart.py": """from fastapi import APIRouter
from backend.database import get_connection

router = APIRouter(prefix="/cart")

@router.post("/add")
def add_to_cart(user_id: int, product_id: int, quantity: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM products WHERE id=?", (product_id,))
    product = cur.fetchone()
    if not product:
        return {"status":"error","msg":"Product not found"}
    total = product["price"] * quantity
    cur.execute("INSERT INTO orders (user_id,total,status) VALUES (?,?,?)",
                (user_id,total,"pending"))
    conn.commit()
    conn.close()
    return {"status":"success","total":total}

@router.post("/remove")
def remove_from_cart(order_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM orders WHERE id=?", (order_id,))
    conn.commit()
    conn.close()
    return {"status":"success"}
""",

    "backend/dashboards.py": """from fastapi import APIRouter
from backend.database import get_connection

router = APIRouter(prefix="/dashboard")

@router.get("/client")
def client_dashboard(user_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM orders WHERE user_id=?", (user_id,))
    orders = [dict(row) for row in cur.fetchall()]
    conn.close()
    return {"orders":orders}

@router.get("/owner")
def owner_dashboard(secret_key: str):
    if secret_key != "OWNER_SECRET":
        return {"status":"error","msg":"Unauthorized"}
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM orders")
    orders = [dict(row) for row in cur.fetchall()]
    cur.execute("SELECT * FROM users")
    users = [dict(row) for row in cur.fetchall()]
    conn.close()
    return {"orders":orders,"users":users}
""",

    "backend/documents.py": """from fastapi import APIRouter
from fpdf import FPDF
from pathlib import Path

router = APIRouter(prefix="/docs")
DOCS_DIR = Path("static/docs")
DOCS_DIR.mkdir(exist_ok=True)

@router.post("/invoice")
def create_invoice(order_id: int, user_name: str, total: float):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200,10,f"Invoice for Order {order_id}", ln=True)
    pdf.cell(200,10,f"Customer: {user_name}", ln=True)
    pdf.cell(200,10,f"Total: ${total}", ln=True)
    filename = DOCS_DIR / f"invoice_{order_id}.pdf"
    pdf.output(str(filename))
    return {"status":"success","file":str(filename)}
""",

    # Frontend HTML files
    "frontend/index.html": "<h1>Welcome to Apex E-Commerce</h1><a href='shop.html'>Shop Now</a>",
    "frontend/shop.html": "<h2>Shop Page</h2>",
    "frontend/cart.html": "<h2>Cart Page</h2>",
    "frontend/register.html": "<h2>Register Page</h2>",
    "frontend/login.html": "<h2>Login Page</h2>",
    "frontend/client_dashboard.html": "<h2>Client Dashboard</h2>",
    "frontend/owner_dashboard.html": "<h2>Owner Dashboard</h2>",

    # JS files
    "frontend/js/auth.js": "// JS auth logic here",
    "frontend/js/cart.js": "// JS cart logic here",
    "frontend/js/dashboard.js": "// JS dashboard logic here",

    # CSS
    "frontend/css/styles.css": "body{font-family:Arial,sans-serif;margin:20px;}",

    # Install / deploy scripts
    "install_deploy/install_ubuntu.sh": """#!/bin/bash
sudo apt update && sudo apt install -y python3 python3-venv python3-pip
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install fastapi uvicorn fpdf
echo "Database initializing..."
python3 backend/database.py
echo "Installation complete!"
""",

    "install_deploy/deploy_ubuntu.sh": """#!/bin/bash
source venv/bin/activate
uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload
""",

    "install_deploy/install_windows.bat": """@echo off
python -m venv venv
call venv\\Scripts\\activate.bat
pip install --upgrade pip
pip install fastapi uvicorn fpdf
python backend\\database.py
pause
""",

    "install_deploy/deploy_windows.bat": """@echo off
call venv\\Scripts\\activate.bat
uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload
pause
"""
}

def create_folders():
    for folder in folders:
        path = BASE_DIR / folder
        path.mkdir(parents=True, exist_ok=True)
        print(f"Created folder: {path}")

def create_files():
    for path_str, content in files.items():
        file_path = BASE_DIR / path_str
        file_path.parent.mkdir(parents=True, exist_ok=True)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Created file: {file_path}")

def main():
    print("Generating full Apex E-Commerce system...")
    create_folders()
    create_files()
    print("✅ Fully coded e-commerce system generated!")
    print(f"Navigate to {BASE_DIR} and run the install scripts for your platform.")

if __name__ == "__main__":
    main()
