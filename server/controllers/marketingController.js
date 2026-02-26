import asyncHandler from 'express-async-handler';
import AdCampaign from '../models/AdCampaign.js';
import { optimizeCampaign } from '../services/ai/campaignAI.js';

// @desc    Create ad campaign
// @route   POST /api/marketing/ad
// @access  Private
export const createAdCampaign = asyncHandler(async (req, res) => {
  const campaign = await AdCampaign.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(campaign);
});

// @desc    Get all ad campaigns
// @route   GET /api/marketing/ad
// @access  Private
export const getAdCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await AdCampaign.find({ createdBy: req.user._id });
  res.json(campaigns);
});

// @desc    Run AI optimization on a campaign
// @route   POST /api/marketing/ad/:id/optimize
// @access  Private
export const optimizeAdCampaign = asyncHandler(async (req, res) => {
  const campaign = await AdCampaign.findById(req.params.id);
  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }
  const optimized = await optimizeCampaign(campaign);
  campaign.targeting = optimized.targeting;
  campaign.budget = optimized.budget;
  campaign.aiOptimized = true;
  await campaign.save();
  res.json(campaign);
});
