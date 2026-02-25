import { anomalyDetector } from '../ai/anomaly.js';

setInterval(() => {
  const recentLogs = getRecentLogs();
  const anomalies = anomalyDetector(recentLogs);
  anomalies.forEach(a => {
    if (a.severity > 0.8) {
      triggerAutoFix(a);
    }
  });
}, 60000);
