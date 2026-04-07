import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  img: String,
  color: String,
  role: String,
  timeline: String,
  goals: [String],
  techStack: [{
    name: String,
    iconType: String
  }]
}, { timestamps: true });

export default (mongoose.models as any).Project || mongoose.model('Project', projectSchema);
