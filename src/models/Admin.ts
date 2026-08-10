import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, default: 'fahaddesigner05@gmail.com' },
  resetCode: { type: String },
  resetCodeExpires: { type: Date }
}, { timestamps: true });

export default (mongoose.models as any).Admin || mongoose.model('Admin', adminSchema);
