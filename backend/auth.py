from fastapi import APIRouter, Form
from backend.database import get_connection
import hashlib

router = APIRouter(prefix="/auth")

def hash_password(pw: str):
    return hashlib.sha256(pw.encode()).hexdigest()

@router.post("/register")
def register(username: str = Form(...), email: str = Form(...), password: str = Form(...)):
    conn = get_connection()
    cur = conn.cursor()
    pw_hash = hash_password(password)
    try:
        cur.execute("INSERT INTO users (username,email,password) VALUES (?,?,?)", (username,email,pw_hash))
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
