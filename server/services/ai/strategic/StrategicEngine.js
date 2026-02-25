import AICore from '../core/index.js';
import { getAllAgentsPerformance } from '../../../utils/metrics.js';

class StrategicEngine {
  async analyze() {
    const performance = await getAllAgentsPerformance();
    // Use AICore to find patterns and suggest optimizations
    const insights = await AICore.understandQuery({
      type: 'strategic',
      data: performance,
      question: 'How can we improve overall performance?'
    });
    // Automatically adjust agent parameters
    await this.applyOptimizations(insights);
    return insights;
  }

  async applyOptimizations(insights) {
    // e.g., adjust designAI temperature, marketingAI bid multiplier
    for (const opt of insights.recommendations) {
      await this.setAgentParam(opt.agent, opt.param, opt.value);
    }
  }
}
