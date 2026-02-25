const campaignSchema = mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  duration: { type: Number, enum: [10,20,30,60,90] }, // days
  platforms: [String], // facebook, google, instagram, etc.
  budget: Number,
  targeting: Object,
  creatives: [String], // URLs to images/videos
  status: { type: String, enum: ['draft', 'active', 'paused', 'completed'] },
  performance: {
    impressions: Number,
    clicks: Number,
    conversions: Number,
    // no revenue/cost here – stored separately in admin model
  },
  aiOptimizations: [{
    timestamp: Date,
    action: String,
    reason: String,
  }],
});
