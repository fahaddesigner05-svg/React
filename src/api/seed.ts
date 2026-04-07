import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../lib/mongodb.js';
import Project from '../models/Project.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    await dbConnect();
    const sampleProjects = [
      {
        title: "Quantum Branding",
        category: "Identity Design",
        description: "A high-end branding project for a tech startup.",
        img: "https://picsum.photos/seed/qnt/800/600",
        videoLink: "https://www.w3schools.com/html/mov_bbb.mp4",
        color: "cyan"
      },
      {
        title: "Nebula UI Kit",
        category: "Mobile Design",
        description: "A comprehensive UI kit for mobile applications.",
        img: "https://picsum.photos/seed/neb/800/600",
        videoLink: "",
        color: "purple"
      },
      {
        title: "Ether Dashboard",
        category: "Web Application",
        description: "A sleek dashboard for a data analytics platform.",
        img: "https://picsum.photos/seed/eth/800/600",
        videoLink: "https://www.w3schools.com/html/movie.mp4",
        color: "cyan"
      },
      {
        title: "Cyberpunk 2077 Art",
        category: "Illustration",
        description: "A futuristic illustration inspired by Cyberpunk 2077.",
        img: "https://picsum.photos/seed/cyb/800/600",
        videoLink: "",
        color: "blue"
      }
    ];
    
    await Project.deleteMany({}); // Clear existing
    const projects = await Project.insertMany(sampleProjects);
    return res.status(201).json({ success: true, data: projects });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(400).json({ success: false, error: error.message });
  }
}
