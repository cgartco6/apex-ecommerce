import threading
import time
from datetime import datetime
import json
from backend.admin_module import CONFIG_FILE, SCHEDULE_FILE, ENGAGEMENT_FILE
from backend.social_media import post_to_social_via_ayrshare
from backend.ai_media.ai_media import generate_full_media

CHECK_INTERVAL = 60  # seconds

def scheduler_loop():
    while True:
        now = datetime.now()
        try:
            with open(SCHEDULE_FILE, "r+") as f:
                schedule = json.load(f)
                updated = False
                for post in schedule:
                    post_time = datetime.fromisoformat(post["post_time"])
                    if not post["posted"] and now >= post_time:
                        # Generate AI media
                        media_assets = generate_full_media(post["product_name"])
                        # Post via Ayrshare
                        post_to_social_via_ayrshare(post["caption"], media_assets)
                        post["posted"] = True
                        updated = True
                if updated:
                    f.seek(0)
                    f.truncate()
                    json.dump(schedule, f)
        except Exception as e:
            print("Scheduler error:", e)

        # Engagement update
        try:
            update_engagement_metrics()
        except Exception as e:
            print("Engagement update error:", e)

        time.sleep(CHECK_INTERVAL)

def update_engagement_metrics():
    with open(CONFIG_FILE) as f:
        api_key = json.load(f).get("ayr_api_key","")
    if not api_key:
        return

    # In production: replace this with Ayrshare engagement API call
    # Here we simulate fetching engagement for all posted items
    with open(SCHEDULE_FILE) as f:
        schedule = json.load(f)
    engagement_updates = []
    for post in schedule:
        if post.get("posted"):
            engagement_updates.append({
                "product_name": post["product_name"],
                "platform":"simulated",
                "likes": 100,
                "shares": 20,
                "comments": 5,
                "timestamp": datetime.now().isoformat()
            })

    with open(ENGAGEMENT_FILE, "r+") as f:
        engagement = json.load(f)
        engagement.extend(engagement_updates)
        f.seek(0)
        f.truncate()
        json.dump(engagement, f)
        print(f"✅ Engagement metrics updated for {len(engagement_updates)} posts")

def start_scheduler():
    t = threading.Thread(target=scheduler_loop, daemon=True)
    t.start()
    print("✅ Scheduler started in background")
