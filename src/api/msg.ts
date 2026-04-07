import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../lib/mongodb.js';
import Message from '../models/Message.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await dbConnect();

    if (req.method === 'GET') {
      const messages = await Message.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: messages });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ success: false, error: 'Message ID is required' });
      const message = await Message.findByIdAndDelete(id);
      if (!message) return res.status(404).json({ success: false, error: 'Message not found' });
      return res.status(200).json({ success: true, data: message });
    }

    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(400).json({ success: false, error: error.message });
  }
}
