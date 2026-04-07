import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../lib/mongodb.js';
import Feedback from '../models/Feedback.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      await dbConnect();
      const { projectId } = req.query;
      const query = projectId ? { projectId } : {};
      const feedbacks = await Feedback.find(query).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: feedbacks });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      await dbConnect();
      const { projectId, name, email, message, rating } = req.body;

      if (!projectId || !name || !email || !message || !rating) {
        return res.status(400).json({ success: false, error: 'Please provide all fields.' });
      }

      const newFeedback = await Feedback.create({ projectId, name, email, message, rating });
      return res.status(201).json({ success: true, data: newFeedback });
    } catch (error: any) {
      console.error('API Error:', error);
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await dbConnect();
      const { id } = req.query;
      if (!id) return res.status(400).json({ success: false, error: 'Feedback ID is required' });
      const feedback = await Feedback.findByIdAndDelete(id);
      if (!feedback) return res.status(404).json({ success: false, error: 'Feedback not found' });
      return res.status(200).json({ success: true, data: feedback });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
