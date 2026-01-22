from launch.launch_checklist import LaunchChecklist
from media.ad_composer import compose
from launch.promotion_strategy import PromotionStrategy
from distribution.scheduler import run
from revenue.tracker import log

if __name__ == "__main__":
    # Verify credentials
    check = LaunchChecklist()
    ok, msg = check.verify()
    print("✅ Launch Check:", msg)
    if not ok:
        exit()

    # Generate ad
    ad = compose("Apex AI Service")

    # Plan promotion
    strategy = PromotionStrategy().plan(ad)
    print("🛠️ Promotion Strategy:", strategy)

    # Schedule autopost
    results = run(strategy["ad_content"])
    print("📣 Scheduled posts:", results)

    # Track revenue
    log(0, "ads")
