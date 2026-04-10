import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  aboutVideoLink: { type: String, default: '' },
  aboutVideoPlaceholder: { type: String, default: '' },
  aboutPageImage: { type: String, default: '' },
  siteName: { type: String, default: 'Fahad Portfolio' },
  siteDescription: { type: String, default: 'Professional Portfolio of Fahad Malik' },
  contactEmail: { type: String, default: 'fahaddesigner05@gmail.com' },
  socialLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    behance: { type: String, default: '' },
    dribbble: { type: String, default: '' }
  },
  themeColor: { type: String, default: '#22d3ee' },
  enableEmailNotifications: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false }
}, { timestamps: true });

export default (mongoose.models as any).Settings || mongoose.model('Settings', settingsSchema);
