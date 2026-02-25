import { getAdPerformance } from '../../utils/adPerformance.js';
import { updateCampaignTargeting } from '../marketingEngine/campaignManager.js';

class TargetAI {
  constructor() {
    this.qTable = {}; // state -> action values
  }

  async optimize(campaignId) {
    const performance = await getAdPerformance(campaignId);
    const state = this.getState(performance);
    const action = this.selectAction(state);
    await updateCampaignTargeting(campaignId, action);
    const reward = this.calculateReward(performance);
    this.updateQTable(state, action, reward);
  }

  getState(perf) {
    // e.g., [impressions, clicks, conversions, timeOfDay]
    return `${perf.impressions},${perf.clicks},${perf.conversions},${new Date().getHours()}`;
  }

  selectAction(state) {
    if (!this.qTable[state]) this.qTable[state] = [0,0,0,0]; // actions: change budget, change audience, change creative, etc.
    return this.qTable[state].indexOf(Math.max(...this.qTable[state]));
  }

  calculateReward(perf) {
    return perf.conversions * 10 - perf.cost; // reward = profit
  }

  updateQTable(state, action, reward) {
    const lr = 0.1;
    const discount = 0.9;
    const oldQ = this.qTable[state][action];
    const nextState = this.getState({}); // future state
    const maxNext = Math.max(...(this.qTable[nextState] || [0]));
    this.qTable[state][action] = oldQ + lr * (reward + discount * maxNext - oldQ);
  }
              }
