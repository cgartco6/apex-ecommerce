import AICore from '../core/index.js';

class CreativeDirector {
  constructor(brandId) {
    this.brandId = brandId;
    this.tasteProfile = null;
  }

  async refineTaste(designs, performance) {
    // Learn which designs performed best
    const taste = await AICore.understandQuery({
      type: 'creative',
      designs,
      performance,
      task: 'extract taste profile'
    });
    this.tasteProfile = taste;
  }

  async generateNextDesign(prompt) {
    // Use taste profile to guide generation
    const enhancedPrompt = `[Taste: ${this.tasteProfile}] ${prompt}`;
    return await AICore.generateCreative(enhancedPrompt, 'futuristic', {});
  }
}
