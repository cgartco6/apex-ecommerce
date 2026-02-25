import { postToTikTok } from './platformClients/tiktok.js';
import { postToFacebook } from './platformClients/facebook.js';
// ... import all

export async function postContent(content) {
  const platforms = ['tiktok', 'facebook', 'instagram', 'twitter', 'youtube', 'truthsocial'];
  const results = await Promise.allSettled(platforms.map(platform => {
    switch(platform) {
      case 'tiktok': return postToTikTok(content);
      case 'facebook': return postToFacebook(content);
      // ...
    }
  }));
  content.postedTo = results.filter(r => r.status === 'fulfilled').map(r => r.value.platform);
  await content.save();
}
