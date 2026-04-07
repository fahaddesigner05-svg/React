import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../lib/mongodb.js';
import Admin from '../models/Admin.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await dbConnect();

    // Ensure at least one admin exists
    let admin = await Admin.findOne({});
    if (!admin) {
      admin = await Admin.create({ username: 'fahadmalik', password: 'fahadmalik123' });
    }

    if (req.method === 'GET') {
      return res.status(200).json({ success: true, data: { username: admin.username, password: admin.password } });
    }

    if (req.method === 'PUT') {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Username and password are required' });
      }

      admin.username = username;
      admin.password = password;
      await admin.save();

      return res.status(200).json({ success: true, data: { username: admin.username, password: admin.password } });
    }

    if (req.method === 'POST') {
      // Used for login verification
      const { username, password } = req.body;
      if (username === admin.username && password === admin.password) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }
    }

    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('Admin API Error:', error);
    return res.status(400).json({ success: false, error: error.message });
  }
}
