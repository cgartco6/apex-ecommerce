from fastapi import APIRouter
from backend.database import get_connection
import json
from pathlib import Path

router = APIRouter(prefix="/dashboard")

SCHEDULE_FILE = Path("backend/admin/schedule.json")
ENGAGEMENT_FILE = Path("backend/admin/engagement.json")

@router.get("/sales")
def get_sales_data():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, user_id, total, status FROM orders")
    orders = cursor.fetchall()
    cursor.close()
    conn.close()
    total_revenue = sum(o['total'] for o in orders)
    return {"orders": orders, "total_revenue": total_revenue}

@router.get("/schedule")
def get_scheduled_posts():
    with open(SCHEDULE_FILE) as f:
        return json.load(f)

@router.get("/engagement")
def get_engagement():
    with open(ENGAGEMENT_FILE) as f:
        return json.load(f)
