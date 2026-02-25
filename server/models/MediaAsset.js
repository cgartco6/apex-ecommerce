const mediaAssetSchema = mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['image', 'video', 'audio', 'music'] },
  prompt: String,
  generatedUrl: String,
  resolution: String, // HD, 4K
  status: String,
});
