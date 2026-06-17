import mongoose from 'mongoose';

const supportResourceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['book', 'video', 'article', 'therapist', 'peer-support'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: String,
  creator: String,
  source: String,
  category: String,
  description: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  duration: String,
  specialties: [String],
  availability: String,
  professionalType: String,
  name: String,
  role: String,
  bio: String,
  verified: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

supportResourceSchema.index({ type: 1, active: 1 });

export default mongoose.model('SupportResource', supportResourceSchema);
