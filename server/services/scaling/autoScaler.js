import { getAvailableFunds } from '../payment/balance.js';
import { scaleDeployment } from '../../infrastructure/k8s/client.js';

const SCALE_THRESHOLD = 10000; // ZAR – when funds > 10k, scale up
const SCALE_DOWN_THRESHOLD = 2000;

setInterval(async () => {
  const balance = await getAvailableFunds(); // sum of payments minus payouts
  if (balance > SCALE_THRESHOLD) {
    await scaleDeployment('marketing-engine', 5); // increase replicas
    await scaleDeployment('ai-services', 3);
  } else if (balance < SCALE_DOWN_THRESHOLD) {
    await scaleDeployment('marketing-engine', 2);
    await scaleDeployment('ai-services', 1);
  }
}, 60000); // check every minute
