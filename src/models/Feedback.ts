import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  projectId: String,
  name: String,
  email: String,
  message: String,
  rating: Number
}, { timestamps: true });

export default (mongoose.models as any).Feedback || mongoose.model('Feedback', feedbackSchema);
