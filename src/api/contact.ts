import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../lib/mongodb.js';
import Message from '../models/Message.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    await dbConnect();
    const { name, email, message, service, budget } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Please provide all fields.' });
    }

    const newMessage = await Message.create({ name, email, message, service, budget });
    return res.status(201).json({ success: true, data: newMessage });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(400).json({ success: false, error: error.message });
  }
}
