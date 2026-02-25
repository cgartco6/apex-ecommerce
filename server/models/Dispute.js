const disputeSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'DesignProject' },
  reason: String,
  evidence: [String],
  status: { type: String, enum: ['open', 'ai_review', 'human_review', 'resolved'] },
  aiDecision: String,
  humanDecision: String,
  resolution: String,
  refundAmount: Number,
});
