from fastapi import APIRouter
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
