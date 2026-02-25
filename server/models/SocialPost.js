const socialPostSchema = mongoose.Schema({
  platform: { type: String, enum: ['facebook', 'twitter', 'instagram', 'linkedin'], required: true },
  content: { type: String, required: true },
  mediaUrl: { type: String },
  scheduledAt: { type: Date },
  publishedAt: { type: Date },
  status: { type: String, enum: ['draft', 'scheduled', 'published', 'failed'], default: 'draft' },
  stats: {
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
// add fields
scheduledAt: Date,
status: { type: String, enum: ['draft', 'scheduled', 'posted', 'failed'] },
contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'GeneratedContent' },
platformPostIds: Map, // platform -> post ID
