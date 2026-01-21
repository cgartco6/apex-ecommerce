import os
import requests
from backend.ai_media.ai_media import generate_full_media

AYR_API_KEY = os.getenv("AYR_API_KEY")

def post_to_social_via_api(product_name, caption):
    # Generate AI media and get URLs (upload to static or CDN first)
    media_assets = generate_full_media(product_name)

    # Assume we have URLs for the generated media
    media_urls = [
        f"https://yourdomain.co.za/static/images/{media_assets['image'].name}",
        f"https://yourdomain.co.za/static/videos/{media_assets['video'].name}"
    ]

    url = "https://api.ayrshare.com/api/post"
    headers = {
        "Authorization": f"Bearer {AYR_API_KEY}",
        "Content-Type": "application/json"
    }
    post_body = {
        "post": caption,
        "platforms": ["facebook","instagram","twitter","tiktok"],
        "mediaUrls": media_urls
    }

    response = requests.post(url, json=post_body, headers=headers)
    return response.json()
