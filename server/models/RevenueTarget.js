const revenueTargetSchema = new mongoose.Schema({
  period: { type: String, enum: ['daily', 'weekly', 'monthly', 'campaign'] },
  targetAmount: Number,
  currentAmount: { type: Number, default: 0 },
  startDate: Date,
  endDate: Date,
  achieved: { type: Boolean, default: false },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
});
