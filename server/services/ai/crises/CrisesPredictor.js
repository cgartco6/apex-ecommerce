import AICore from '../core/index.js';
import { getRecentMentions } from '../../../utils/socialMonitor.js';

class CrisisPredictor {
  async scan() {
    const mentions = await getRecentMentions();
    const alerts = await AICore.predictTrends({
      type: 'crisis',
      data: mentions,
      horizon: '24h'
    });
    if (alerts.length > 0) {
      await this.triggerAlerts(alerts);
    }
    return alerts;
  }

  async triggerAlerts(alerts) {
    // Send notifications to dashboard, email, Slack
    // Possibly auto‑draft response messages
  }
}
