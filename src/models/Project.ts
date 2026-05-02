import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  img: String,
  images: [String],
  coverImg: String,
  videoLink: String,
  videoLinks: [String],
  figmaLink: String,
  externalLink: String,
  externalLinkText: String,
  color: String,
  role: String,
  timeline: String,
  goals: [String],
  techStack: [{
    name: String,
    iconType: String
  }],
  showOnHome: { type: Boolean, default: false }
}, { timestamps: true });

export default (mongoose.models as any).Project || mongoose.model('Project', projectSchema);
