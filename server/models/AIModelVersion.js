const modelVersionSchema = new mongoose.Schema({
  type: String,                // 'design', 'campaign', 'chatbot', ...
  version: String,
  accuracy: Number,
  threshold: Number,
  trainingData: String,        // path or ref
  status: { type: String, enum: ['training', 'active', 'deprecated'] },
  deployedAt: Date,
});
