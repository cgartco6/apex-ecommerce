import mongoose from 'mongoose';

const designProjectSchema = mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['billboard', 'vehicle wrap', 'logo', 'poster', ...], required: true },
  style: { type: String, enum: ['classic', 'cartoon', 'animated', 'traditional', 'modern', 'futuristic', 'out of the box'] },
  description: { type: String },
  generatedDesigns: [{
    url: String,
    aiModel: String,        // which AI generated it
    createdAt: Date,
    qualityScore: Number,   // from AI reviewer
  }],
  finalDesign: { type: String }, // URL after approval
  status: { type: String, enum: ['pending', 'ai_generating', 'quality_review', 'client_review', 'approved', 'rejected'], default: 'pending' },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DesignReview' }],
}, { timestamps: true });
