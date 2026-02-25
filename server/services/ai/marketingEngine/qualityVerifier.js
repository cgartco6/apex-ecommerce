import { aiReview } from '../ai/qualityAI.js';

export async function verifyContent(contentId) {
  const content = await GeneratedContent.findById(contentId);
  const scores = await Promise.all(content.generatedUrls.map(url => aiReview(url)));
  content.qualityScore = scores.reduce((a,b) => a+b, 0) / scores.length;
  content.verified = true;
  content.approved = content.qualityScore > 0.75; // threshold
  await content.save();
  return content;
}
