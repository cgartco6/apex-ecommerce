const impulseBuyerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adClickedAt: Date,
  purchaseAt: Date,
  timeToPurchase: Number, // seconds
  revenue: Number,
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
});
