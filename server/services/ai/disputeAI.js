import { getChatResponse } from './chatbotAI.js';

export async function evaluateDispute(dispute) {
  const prompt = `Resolve this dispute: ${dispute.reason}\nEvidence: ${dispute.evidence}`;
  const decision = await getChatResponse(prompt, 'dispute-agent');
  return { decision, confidence: 0.85 };
}
