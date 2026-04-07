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

app.post('/api/projects', async (req, res) => {
  try {
    await dbConnect();
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.put('/api/projects', async (req, res) => {
  try {
    await dbConnect();
    const { id, ...updateData } = req.body;
    if (!id) return res.status(400).json({ success: false, error: 'Project ID is required' });
    const project = await Project.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
    res.status(200).json({ success: true, data: project });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.delete('/api/projects', async (req, res) => {
  try {
    await dbConnect();
    const { id } = req.query;
    if (!id) return res.status(400).json({ success: false, error: 'Project ID is required' });
    const project = await Project.findByIdAndDelete(id);
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
    res.status(200).json({ success: true, data: project });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Contact Form API
app.post('/api/contact', async (req, res) => {
  try {
    await dbConnect();
    const { name, email, message, service, budget } = req.body;
    if (!name || !email || !message) return res.status(400).json({ success: false, error: 'Please provide all fields.' });
    const newMessage = await Message.create({ name, email, message, service, budget });
    res.status(201).json({ success: true, data: newMessage });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Feedback API
app.post('/api/feedback', async (req, res) => {
  try {
    await dbConnect();
    const { projectId, name, email, message, rating } = req.body;
    if (!projectId || !name || !email || !message || !rating) return res.status(400).json({ success: false, error: 'Please provide all fields.' });
    const newFeedback = await Feedback.create({ projectId, name, email, message, rating });
    res.status(201).json({ success: true, data: newFeedback });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/feedback', async (req, res) => {
  try {
    await dbConnect();
    const { projectId } = req.query;
    const query = projectId ? { projectId } : {};
    const feedbacks = await Feedback.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: feedbacks });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.delete('/api/feedback', async (req, res) => {
  try {
    await dbConnect();
    const { id } = req.query;
    if (!id) return res.status(400).json({ success: false, error: 'Feedback ID is required' });
    const feedback = await Feedback.findByIdAndDelete(id);
    if (!feedback) return res.status(404).json({ success: false, error: 'Feedback not found' });
    res.status(200).json({ success: true, data: feedback });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Messages API
app.get('/api/messages', async (req, res) => {
  try {
    await dbConnect();
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.delete('/api/messages', async (req, res) => {
  try {
    await dbConnect();
    const { id } = req.query;
    if (!id) return res.status(400).json({ success: false, error: 'Message ID is required' });
    const message = await Message.findByIdAndDelete(id);
    if (!message) return res.status(404).json({ success: false, error: 'Message not found' });
    res.status(200).json({ success: true, data: message });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Admin API
app.get('/api/admin', async (req, res) => {
  try {
    await dbConnect();
    let admin = await Admin.findOne({});
    if (!admin) admin = await Admin.create({ username: 'fahadmalik', password: 'fahadmalik123' });
    res.status(200).json({ success: true, data: { username: admin.username, password: admin.password } });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/admin', async (req, res) => {
  try {
    await dbConnect();
    const { username, password } = req.body;
    let admin = await Admin.findOne({});
    if (!admin) admin = await Admin.create({ username: 'fahadmalik', password: 'fahadmalik123' });
    if (username === admin.username && password === admin.password) res.status(200).json({ success: true });
    else res.status(401).json({ success: false, error: 'Invalid credentials' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.put('/api/admin', async (req, res) => {
  try {
    await dbConnect();
    const { username, password } = req.body;
    let admin = await Admin.findOne({});
    if (!admin) admin = await Admin.create({ username: 'fahadmalik', password: 'fahadmalik123' });
    admin.username = username;
    admin.password = password;
    await admin.save();
    res.status(200).json({ success: true, data: { username: admin.username, password: admin.password } });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Settings API
app.get('/api/settings', async (req, res) => {
  try {
    await dbConnect();
    let settings = await Settings.findOne({});
    if (!settings) settings = await Settings.create({ aboutVideoLink: '' });
    res.status(200).json({ success: true, data: settings });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    await dbConnect();
    let settings = await Settings.findOne({});
    if (!settings) settings = await Settings.create(req.body);
    else settings = await Settings.findOneAndUpdate({}, req.body, { new: true });
    res.status(200).json({ success: true, data: settings });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Analytics API
app.get('/api/analytics', async (req, res) => {
  try {
    await dbConnect();
    const analytics = await Analytics.find({});
    const data = {
      views: analytics.find(a => a.type === 'views')?.count || 0,
      clicks: analytics.find(a => a.type === 'clicks')?.count || 0,
    };
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/analytics', async (req, res) => {
  try {
    await dbConnect();
    const { type } = req.body;
    if (!type || !['views', 'clicks'].includes(type)) return res.status(400).json({ success: false, error: 'Invalid analytic type' });
    const analytic = await Analytics.findOneAndUpdate({ type }, { $inc: { count: 1 } }, { upsert: true, returnDocument: 'after' });
    res.status(200).json({ success: true, data: analytic });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.delete('/api/analytics/reset', async (req, res) => {
  try {
    await dbConnect();
    await Analytics.updateMany({}, { $set: { count: 0 } });
    res.status(200).json({ success: true, message: 'Analytics reset successfully' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Seed Route
app.post('/api/projects/seed', async (req, res) => {
  try {
    await dbConnect();
    const sampleProjects = [
      { title: "Quantum Branding", category: "Identity Design", description: "A high-end branding project...", img: "https://picsum.photos/seed/qnt/800/600", color: "cyan", role: "Lead Designer", timeline: "March 2026", goals: ["Establish a robust and trustworthy online identity", "Complete a full-scale, responsive build"], techStack: [{ name: "Wordpress", iconType: "Globe" }, { name: "Elementor", iconType: "Layout" }] },
      { title: "Nebula UI Kit", category: "Mobile Design", description: "A comprehensive UI kit...", img: "https://picsum.photos/seed/neb/800/600", color: "purple", role: "UI/UX Designer", timeline: "February 2026", goals: ["Create a versatile UI kit", "Implement high-end CSS styling"], techStack: [{ name: "React", iconType: "Code" }, { name: "Framer Motion", iconType: "Layers" }] },
      { title: "Ether Dashboard", category: "Web Application", description: "A sleek dashboard...", img: "https://picsum.photos/seed/eth/800/600", color: "cyan", role: "Full Stack Developer", timeline: "January 2026", goals: ["Optimize for search engines (SEO)", "Build a real-time dashboard"], techStack: [{ name: "Node.js", iconType: "Code" }, { name: "MongoDB", iconType: "Layers" }] }
    ];
    await Project.deleteMany({});
    const projects = await Project.insertMany(sampleProjects);
    res.status(201).json({ success: true, data: projects });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default app;
