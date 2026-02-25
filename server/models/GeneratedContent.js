import mongoose from 'mongoose';

const generatedContentSchema = new mongoose.Schema({
  type: { type: String, enum: ['image', 'video', 'audio', 'poster', 'reel', 'short', 'voice'] },
  prompt: String,
  style: String, // e.g., 'modern', 'futuristic', 'cartoon'
  generatedUrls: [String],
  qualityScore: Number,
  verified: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  scheduledAt: Date,
  postedTo: [String], // platform names
});
