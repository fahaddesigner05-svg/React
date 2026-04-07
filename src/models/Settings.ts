import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  aboutVideoLink: { type: String, default: '' }
}, { timestamps: true });

export default (mongoose.models as any).Settings || mongoose.model('Settings', settingsSchema);
