from fastapi import APIRouter
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
    cur.execute("INSERT INTO orders (user_id,total,status) VALUES (?,?,?)", (user_id,total,"pending"))
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
