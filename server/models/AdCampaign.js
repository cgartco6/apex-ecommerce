import mongoose from 'mongoose';

const adCampaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  platform: { type: String, enum: ['facebook', 'google', 'tiktok', 'twitter', 'linkedin'] },
  budget: Number,
  spent: { type: Number, default: 0 },
  startDate: Date,
  endDate: Date,
  targeting: Object,
  creatives: [String],
  performance: {
    impressions: Number,
    clicks: Number,
    conversions: Number,
    ctr: Number,
    cpc: Number
  },
  status: { type: String, enum: ['draft', 'active', 'paused', 'completed'] },
  aiOptimized: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('AdCampaign', adCampaignSchema);
