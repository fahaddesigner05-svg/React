import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import dbConnect from '../src/lib/mongodb.js';
import Project from '../src/models/Project.js';
import Message from '../src/models/Message.js';
import Admin from '../src/models/Admin.js';
import Analytics from '../src/models/Analytics.js';
import Settings from '../src/models/Settings.js';
import Feedback from '../src/models/Feedback.js';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Cloudinary Signing API
app.get('/api/upload/sign', (req, res) => {
  try {
    const timestamp = Math.round((new Date()).getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp: timestamp, folder: 'portfolio' },
      process.env.CLOUDINARY_API_SECRET!
    );
    res.status(200).json({
      success: true,
      signature,
      timestamp,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      folder: 'portfolio'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Projects API
app.get('/api/projects', async (req, res) => {
  try {
    await dbConnect();
    const projects = await Project.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: projects });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ... (Add other API routes here, following the same pattern)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ success: false, error: 'Internal Server Error', message: err.message });
});

export default app;
