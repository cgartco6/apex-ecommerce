import axios from 'axios';

export async function generateImage(prompt, style) {
  // Example using Stable Diffusion API
  const response = await axios.post('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
    text_prompts: [{ text: prompt, weight: 1 }],
    cfg_scale: 7,
    height: 1024,
    width: 1024,
    samples: 1,
    steps: 30,
  }, {
    headers: { Authorization: `Bearer ${process.env.STABILITY_API_KEY}` }
  });
  return response.data.artifacts.map(a => a.base64);
}
