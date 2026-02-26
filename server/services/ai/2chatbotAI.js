import { sentiment } from 'sentiment';

export async function getChatResponse(message, sessionId) {
  const score = sentiment(message);
  let tone = 'neutral';
  if (score > 0.5) tone = 'happy';
  else if (score < -0.3) tone = 'sympathetic';
  const context = await getSessionContext(sessionId);
  const prompt = `[Tone: ${tone}]\n${context}\nUser: ${message}\nRobyn:`;
  return await callLLM(prompt);
}
