import { getClientHistory } from '../../utils/clientHistory.js';
import { cosineSimilarity } from 'mathjs';

export async function recommendServices(clientId) {
  const history = await getClientHistory(clientId);
  // ... matrix factorization or simple similarity
  const similarClients = await findSimilar(history);
  const recommendations = aggregateServices(similarClients);
  return recommendations;
}
