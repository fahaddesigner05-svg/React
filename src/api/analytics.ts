import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../lib/mongodb.js';
import Analytics from '../models/Analytics.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await dbConnect();

    if (req.method === 'GET') {
      const analytics = await Analytics.find({});
      const data = {
        views: analytics.find(a => a.type === 'views')?.count || 0,
        clicks: analytics.find(a => a.type === 'clicks')?.count || 0,
      };
      return res.status(200).json({ success: true, data });
    }

    if (req.method === 'POST') {
      const { type } = req.body;
      if (!type || !['views', 'clicks'].includes(type)) {
        return res.status(400).json({ success: false, error: 'Invalid analytic type' });
      }

      const analytic = await Analytics.findOneAndUpdate(
        { type },
        { $inc: { count: 1 } },
        { upsert: true, new: true }
      );

      return res.status(200).json({ success: true, data: analytic });
    }

    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('Analytics API Error:', error);
    return res.status(400).json({ success: false, error: error.message });
  }
}
