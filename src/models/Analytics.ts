import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  type: { type: String, required: true },
  count: { type: Number, default: 0 }
}, { timestamps: true });

export default (mongoose.models as any).Analytics || mongoose.model('Analytics', analyticsSchema);
