import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  service: String,
  budget: String
}, { timestamps: true });

export default (mongoose.models as any).Message || mongoose.model('Message', messageSchema);
