const designReviewSchema = mongoose.Schema({
  designProject: { type: mongoose.Schema.Types.ObjectId, ref: 'DesignProject' },
  reviewer: { type: String, enum: ['ai', 'human'] },
  comments: String,
  passed: Boolean,
  corrections: [String],
});
