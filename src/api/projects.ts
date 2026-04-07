import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../lib/mongodb.js';
import Project from '../models/Project.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await dbConnect();

    if (req.method === 'GET') {
      const projects = await Project.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: projects });
    }

    if (req.method === 'POST') {
      const project = await Project.create(req.body);
      return res.status(201).json({ success: true, data: project });
    }

    if (req.method === 'PUT') {
      const { id, ...updateData } = req.body;
      if (!id) return res.status(400).json({ success: false, error: 'Project ID is required' });
      const project = await Project.findByIdAndUpdate(id, updateData, { new: true });
      if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
      return res.status(200).json({ success: true, data: project });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ success: false, error: 'Project ID is required' });
      const project = await Project.findByIdAndDelete(id);
      if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
      return res.status(200).json({ success: true, data: project });
    }

    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(400).json({ success: false, error: error.message });
  }
}
