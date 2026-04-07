import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../lib/mongodb.js';
import Settings from '../models/Settings.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await dbConnect();

    if (req.method === 'GET') {
      let settings = await Settings.findOne({});
      if (!settings) {
        settings = await Settings.create({ aboutVideoLink: '', aboutVideoPlaceholder: '' });
      }
      return res.status(200).json({ success: true, data: settings });
    }

    if (req.method === 'PUT') {
      let settings = await Settings.findOne({});
      if (settings) {
        settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true });
      } else {
        settings = await Settings.create(req.body);
      }
      return res.status(200).json({ success: true, data: settings });
    }

    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(400).json({ success: false, error: error.message });
  }
}
