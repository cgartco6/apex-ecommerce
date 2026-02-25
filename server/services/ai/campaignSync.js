export async function optimizeBudgets() {
  const campaigns = await Campaign.find({ status: 'active' });
  for (const campaign of campaigns) {
    const perPlatform = campaign.platforms;
    const performance = await Promise.all(perPlatform.map(p => getPlatformStats(p, campaign)));
    const totalConv = performance.reduce((sum, p) => sum + p.conversions, 0);
    const newAllocation = performance.map(p => ({
      platform: p.platform,
      budget: (p.conversions / totalConv) * campaign.totalBudget,
    }));
    await updateCampaignBudgets(campaign._id, newAllocation);
  }
}
