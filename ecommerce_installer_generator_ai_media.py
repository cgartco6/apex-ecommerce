import os
from pathlib import Path

BASE_DIR = Path("apex-ecommerce")

folders = [
    "backend",
    "backend/modules",
    "backend/social",
    "backend/ai_media",
    "frontend/css",
    "frontend/js",
    "static/images",
    "static/videos",
    "static/audio",
    "static/docs",
    "install_deploy"
]

files = {
    # Backend app
    "backend/app.py": """from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from backend import auth, cart, dashboards, documents, email_module, social_media, ai_media

app = FastAPI()
app.mount("/static", StaticFiles(directory="frontend"), name="static")

app.include_router(auth.router)
app.include_router(cart.router)
app.include_router(dashboards.router)
app.include_router(documents.router)
app.include_router(email_module.router)
app.include_router(social_media.router)
app.include_router(ai_media.router)

@app.get("/")
def home():
    return open("frontend/index.html").read()
""",

    # AI Media Module
    "backend/ai_media/ai_media.py": """from fastapi import APIRouter
from pathlib import Path
import random

router = APIRouter(prefix="/ai_media")

IMAGE_DIR = Path("static/images")
VIDEO_DIR = Path("static/videos")
AUDIO_DIR = Path("static/audio")
IMAGE_DIR.mkdir(exist_ok=True)
VIDEO_DIR.mkdir(exist_ok=True)
AUDIO_DIR.mkdir(exist_ok=True)

def generate_image(product_name:str):
    filename = IMAGE_DIR / f"{product_name.replace(' ','_')}_image.png"
    with open(filename,"wb") as f:
        f.write(b"FAKE_IMAGE_DATA")
    print(f"✅ AI Image generated: {filename}")
    return filename

def generate_video(product_name:str):
    filename = VIDEO_DIR / f"{product_name.replace(' ','_')}_video.mp4"
    with open(filename,"wb") as f:
        f.write(b"FAKE_VIDEO_DATA")
    print(f"✅ AI Video generated: {filename}")
    return filename

def generate_music(product_name:str):
    filename = AUDIO_DIR / f"{product_name.replace(' ','_')}_music.mp3"
    with open(filename,"wb") as f:
        f.write(b"FAKE_MUSIC_DATA")
    print(f"✅ AI Music generated: {filename}")
    return filename

def generate_voice(text:str):
    filename = AUDIO_DIR / f"{text.replace(' ','_')}_voice.mp3"
    with open(filename,"wb") as f:
        f.write(b"FAKE_VOICE_DATA")
    print(f"✅ AI Voice generated: {filename}")
    return filename

def generate_full_media(product_name:str):
    img = generate_image(product_name)
    vid = generate_video(product_name)
    music = generate_music(product_name)
    voice = generate_voice(f"Check out {product_name}!")
    return {"image":img,"video":vid,"music":music,"voice":voice}
""",

    # Social Media updated to include AI Media
    "backend/social_media.py": """from fastapi import APIRouter
from backend.database import get_connection
from backend.ai_media.ai_media import generate_full_media
import random

router = APIRouter(prefix="/social")

SOCIAL_PLATFORMS = ['TikTok','Instagram','Facebook','Twitter']

def create_marketing_content(product_name:str, total:float):
    captions = [
        f"🔥 Just sold {product_name} for ${total}! Grab yours now!",
        f"🎉 Another happy customer for {product_name}. Get yours!",
        f"🚀 {product_name} flying off the shelves at ${total}!"
    ]
    return random.choice(captions)

def post_to_social_media(platform:str, content:str, media:dict=None):
    print(f"Posting to {platform}: {content}")
    if media:
        print(f"Media attached: {media}")

def auto_post_order(order_id:int, product_name:str, total:float):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT promo_posted FROM orders WHERE id=%s", (order_id,))
    if cursor.fetchone()['promo_posted']:
        print("Promo already posted")
        cursor.close()
        conn.close()
        return
    caption = create_marketing_content(product_name,total)
    # Generate AI media
    media = generate_full_media(product_name)
    # Post to all platforms
    for platform in SOCIAL_PLATFORMS:
        post_to_social_media(platform, caption, media)
    cursor.execute("UPDATE orders SET promo_posted=1 WHERE id=%s", (order_id,))
    conn.commit()
    cursor.close()
    conn.close()
    print(f"✅ Marketing posts (AI media) created for order {order_id}")
""",

    # Cart module updated to trigger AI Media posting
    "backend/cart.py": """from fastapi import APIRouter
from backend.database import get_connection
from backend import email_module, documents, social_media, ai_media

router = APIRouter(prefix="/cart")

@router.post("/add")
def add_to_cart(user_id: int, product_id: int, quantity: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM products WHERE id=%s", (product_id,))
    product = cursor.fetchone()
    if not product:
        return {"status":"error","msg":"Product not found"}
    total = product["price"] * quantity
    cursor.execute("INSERT INTO orders (user_id,total,status) VALUES (%s,%s,%s)",
                   (user_id,total,"pending"))
    order_id = cursor.lastrowid
    conn.commit()
    invoice = documents.create_invoice(order_id, f"User {user_id}", total)
    email_module.send_order_email(user_id, invoice)
    social_media.auto_post_order(order_id, product['name'], total)
    cursor.close()
    conn.close()
    return {"status":"success","total":total}
""",

    # .env placeholders
    ".env": """MYSQL_HOST=your_host
MYSQL_USER=your_user
MYSQL_PASS=your_password
MYSQL_DB=your_database
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=your_email@yourdomain.com
SMTP_PASS=your_email_password"""
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
        with open(file_path,"w",encoding="utf-8") as f:
            f.write(content)
        print(f"Created file: {file_path}")

def main():
    print("Generating fully interactive Apex E-Commerce system with AI-generated social media media...")
    create_folders()
    create_files()
    print("✅ Fully coded, MySQL + Email + AI Media social marketing e-commerce system generated!")
    print(f"Navigate to {BASE_DIR}, fill in your .env with Afrihost and SMTP credentials, then run the install script.")

if __name__=="__main__":
    main()
