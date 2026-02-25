import axios from 'axios';
import { generateImage } from '../ai/imageAI.js';
import { generateVideo } from '../ai/videoAI.js';
import { generateVoice } from '../ai/voiceAI.js';
import GeneratedContent from '../../models/GeneratedContent.js';

export async function createMarketingContent(type, prompt, style) {
  let urls = [];
  switch(type) {
    case 'image':
    case 'poster':
      urls = await generateImage(prompt, style);
      break;
    case 'video':
    case 'reel':
    case 'short':
      urls = await generateVideo(prompt, style, type);
      break;
    case 'voice':
      urls = await generateVoice(prompt);
      break;
  }
  const content = new GeneratedContent({ type, prompt, style, generatedUrls: urls });
  await content.save();
  return content;
}
