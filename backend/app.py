from fastapi import FastAPI, Request, Depends
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from backend import auth, cart, dashboards, documents, database

app = FastAPI()
app.mount("/static", StaticFiles(directory="frontend/static"), name="static")

# Home page
@app.get("/", response_class=HTMLResponse)
async def home():
    return open("frontend/index.html").read()

# Include routers
app.include_router(auth.router)
app.include_router(cart.router)
app.include_router(dashboards.router)
app.include_router(documents.router)
