import axios from 'axios';

export async function optimizeCampaign(campaign) {
  // Call external AI API or internal model
  // For demo, return random adjustments
  return {
    targeting: { ...campaign.targeting, ageRange: [25, 40] },
    budget: campaign.budget * 1.1
  };
}
