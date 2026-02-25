import { getChatResponse } from '../services/ai/chatbotAI.js';

export const chat = async (req, res) => {
  const { message, sessionId } = req.body;
  const reply = await getChatResponse(message, sessionId);
  res.json({ reply });
};
