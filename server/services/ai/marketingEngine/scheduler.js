import cron from 'node-cron';
import { postContent } from './poster.js';
import GeneratedContent from '../../models/GeneratedContent.js';

// Run every hour to post scheduled content
cron.schedule('0 * * * *', async () => {
  const now = new Date();
  const toPost = await GeneratedContent.find({
    scheduledAt: { $lte: now },
    approved: true,
    postedTo: { $size: 0 }
  });
  for (const content of toPost) {
    await postContent(content);
  }
});
