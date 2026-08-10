import './env-setup';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import dbConnect from './src/lib/mongodb';
import Project from './src/models/Project';
import Message from './src/models/Message';
import Admin from './src/models/Admin';
import Analytics from './src/models/Analytics';
import Settings from './src/models/Settings';
import Feedback from './src/models/Feedback';

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dmoboiirw',
  api_key: process.env.CLOUDINARY_API_KEY || '274973358699138',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'UmDN63xbyl0lmVb4-uZAjXTs6hs'
};

cloudinary.config(cloudinaryConfig);

async function sendVerificationEmail(recipient: string, code: string) {
  const user = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : '';
  const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '';

  if (!user || !pass) {
    console.log(`[Email Notice] EMAIL_USER or EMAIL_PASS not configured. Code generated: ${code}`);
    return { sent: false, code };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass }
    });

    await transporter.sendMail({
      from: `"Admin Security" <${user}>`,
      to: recipient,
      subject: 'Your Admin Password Reset Code (OTP)',
      text: `Your password reset verification code is: ${code}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #38bdf8; margin-top: 0;">Admin Password Reset</h2>
          <p style="color: #cbd5e1; font-size: 14px;">Use the verification code below to reset your admin portal password:</p>
          <div style="background-color: #1e293b; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; border: 1px solid #334155;">
            <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #38bdf8;">${code}</span>
          </div>
          <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `
    });
    return { sent: true };
  } catch (err: any) {
    console.error('Nodemailer error:', err);
    return { sent: false, error: err?.message || 'Email transport error' };
  }
}

async function sendContactNotificationEmail(contactData: { name: string; email: string; message: string; service?: string; budget?: string }) {
  const user = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : '';
  const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '';
  const recipient = user || 'fahaddesigner05@gmail.com';

  if (!user || !pass) {
    console.log(`[Contact Email Notice] EMAIL_USER or EMAIL_PASS not configured. Message from ${contactData.name} saved.`);
    return { sent: false };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass }
    });

    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${user}>`,
      to: recipient,
      replyTo: contactData.email,
      subject: `New Portfolio Message from ${contactData.name}`,
      text: `You received a new message on your Portfolio from ${contactData.name} (${contactData.email}):\n\n${contactData.message}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 550px; margin: 0 auto;">
          <h2 style="color: #38bdf8; margin-top: 0;">New Contact Message on Portfolio</h2>
          <p style="color: #cbd5e1; font-size: 15px;">A visitor named <strong style="color: #38bdf8;">${contactData.name}</strong> sent you a message through your Portfolio contact form:</p>
          
          <div style="background-color: #1e293b; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #334155;">
            <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 13px;"><strong>Sender Name:</strong> <span style="color: #f8fafc;">${contactData.name}</span></p>
            <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 13px;"><strong>Sender Email:</strong> <a href="mailto:${contactData.email}" style="color: #38bdf8;">${contactData.email}</a></p>
            ${contactData.service ? `<p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 13px;"><strong>Requested Service:</strong> <span style="color: #f8fafc;">${contactData.service}</span></p>` : ''}
            ${contactData.budget ? `<p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 13px;"><strong>Budget:</strong> <span style="color: #f8fafc;">${contactData.budget}</span></p>` : ''}
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #334155;">
              <p style="margin: 0 0 5px 0; color: #94a3b8; font-size: 13px;"><strong>Message:</strong></p>
              <p style="margin: 0; color: #e2e8f0; font-size: 14px; white-space: pre-wrap; line-height: 1.5;">${contactData.message}</p>
            </div>
          </div>
          
          <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">Sent automatically from your Portfolio Website.</p>
        </div>
      `
    });
    return { sent: true };
  } catch (err: any) {
    console.error('Nodemailer Contact Email Error:', err);
    return { sent: false, error: err?.message };
  }
}


// Configure Multer (Only for small metadata if needed, but we'll use JSON for projects)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } 
});

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static('uploads'));

// Cloudinary Signing API (For secure client-side uploads)
app.get('/api/upload/sign', (req, res) => {
  try {
    const timestamp = Math.round((new Date()).getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: 'portfolio',
      },
      cloudinaryConfig.api_secret
    );

    res.status(200).json({
      success: true,
      signature,
      timestamp,
      cloud_name: cloudinaryConfig.cloud_name,
      api_key: cloudinaryConfig.api_key,
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
    console.error('API Error:', error);
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
    
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Please provide all fields.' });
    }

    const newMessage = await Message.create({ name, email, message, service, budget });

    // Send email notification to portfolio owner
    try {
      await sendContactNotificationEmail({ name, email, message, service, budget });
    } catch (emailErr) {
      console.error('Failed to send contact notification email:', emailErr);
    }

    res.status(201).json({ success: true, data: newMessage });
  } catch (error: any) {
    console.error('API Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// Feedback API
app.post('/api/feedback', async (req, res) => {
  try {
    await dbConnect();
    const { projectId, name, email, message, rating } = req.body;
    
    if (!projectId || !name || !email || !message || !rating) {
      return res.status(400).json({ success: false, error: 'Please provide all fields.' });
    }

    const newFeedback = await Feedback.create({ projectId, name, email, message, rating });
    res.status(201).json({ success: true, data: newFeedback });
  } catch (error: any) {
    console.error('API Error:', error);
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

// Messages API (for Admin)
app.get('/api/messages', async (req, res) => {
  try {
    await dbConnect();
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error: any) {
    console.error('API Error:', error);
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
    const targetEmail = process.env.EMAIL_USER || 'fahaddesigner05@gmail.com';
    let admin = await Admin.findOne({ email: targetEmail }) || await Admin.findOne({});
    if (!admin) {
      admin = await Admin.create({ username: 'fahadmalik', password: 'fahadmalik123', email: targetEmail });
    }
    res.status(200).json({ success: true, data: { username: admin.username, password: admin.password, email: admin.email } });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/admin', async (req, res) => {
  try {
    await dbConnect();
    let body = req.body;
    if (Buffer.isBuffer(body)) {
      try {
        body = JSON.parse(body.toString('utf-8'));
      } catch (e) {
        // ignore parse error
      }
    } else if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // ignore parse error
      }
    }
    const { action, username, password, code, newPassword, email: reqEmail } = body || {};

    const targetEmail = reqEmail || process.env.EMAIL_USER || 'fahaddesigner05@gmail.com';

    let admin = await Admin.findOne({ email: targetEmail }) || await Admin.findOne({});
    if (!admin) {
      admin = await Admin.create({ username: 'fahadmalik', password: 'fahadmalik123', email: targetEmail });
    }
    if (!admin.email) {
      admin.email = targetEmail;
      await admin.save();
    }

    if (action === 'forgot-password') {
      const emailToFind = reqEmail || 'fahaddesigner05@gmail.com';
      let adminDoc = await Admin.findOne({ email: emailToFind }) || await Admin.findOne({});
      if (!adminDoc) {
        return res.status(404).json({ success: false, error: 'Email not found' });
      }

      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      adminDoc.resetCode = resetCode;
      adminDoc.resetCodeExpires = resetCodeExpires;
      if (!adminDoc.email) {
        adminDoc.email = emailToFind;
      }
      await adminDoc.save();

      const recipientEmail = adminDoc.email || emailToFind;
      const emailRes = await sendVerificationEmail(recipientEmail, resetCode);

      return res.status(200).json({
        success: true,
        message: 'OTP sent to email',
        email: recipientEmail,
        code: !emailRes.sent ? resetCode : undefined
      });
    }

    if (action === 'verify-code') {
      if (!code || !admin.resetCode) {
        return res.status(400).json({ success: false, error: 'Verification code is required' });
      }
      if (admin.resetCode.trim() !== code.toString().trim()) {
        return res.status(400).json({ success: false, error: 'Incorrect verification code' });
      }
      if (admin.resetCodeExpires && new Date(admin.resetCodeExpires).getTime() < Date.now()) {
        return res.status(400).json({ success: false, error: 'Verification code has expired. Please request a new one.' });
      }
      return res.status(200).json({ success: true, message: 'Code verified successfully' });
    }

    if (action === 'reset-password') {
      if (!newPassword) {
        return res.status(400).json({ success: false, error: 'New password is required' });
      }

      // Verify code if provided
      if (code && admin.resetCode) {
        if (admin.resetCode.trim() !== code.toString().trim()) {
          return res.status(400).json({ success: false, error: 'Incorrect verification code' });
        }
        if (admin.resetCodeExpires && new Date(admin.resetCodeExpires).getTime() < Date.now()) {
          return res.status(400).json({ success: false, error: 'Verification code has expired' });
        }
      }

      admin.password = newPassword;
      admin.resetCode = undefined;
      admin.resetCodeExpires = undefined;
      await admin.save();

      return res.status(200).json({ success: true, message: 'Password updated successfully' });
    }

    if (action) {
      return res.status(400).json({ success: false, error: 'Invalid action requested' });
    }

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required' });
    }

    if (username === admin.username && password === admin.password) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.put('/api/admin', async (req, res) => {
  try {
    await dbConnect();
    const { username, password } = req.body;
    let admin = await Admin.findOne({});
    if (!admin) {
      admin = await Admin.create({ username: 'fahadmalik', password: 'fahadmalik123' });
    }
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
    if (!settings) {
      settings = await Settings.create({ aboutVideoLink: '' });
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    await dbConnect();
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findOneAndUpdate({}, req.body, { new: true });
    }
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
    if (!type || !['views', 'clicks'].includes(type)) {
      return res.status(400).json({ success: false, error: 'Invalid analytic type' });
    }
    const analytic = await Analytics.findOneAndUpdate(
      { type },
      { $inc: { count: 1 } },
      { upsert: true, returnDocument: 'after' }
    );
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

// Seed Route (Optional, for initial testing)
app.post('/api/projects/seed', async (req, res) => {
  try {
    await dbConnect();
    const sampleProjects = [
      {
        title: "Quantum Branding",
        category: "Identity Design",
        description: "A high-end branding project for a tech startup focused on established a robust and trustworthy online identity.",
        img: "https://picsum.photos/seed/qnt/800/600",
        color: "cyan",
        role: "Lead Designer",
        timeline: "March 2026",
        goals: ["Establish a robust and trustworthy online identity", "Complete a full-scale, responsive build"],
        techStack: [{ name: "Wordpress", iconType: "Globe" }, { name: "Elementor", iconType: "Layout" }]
      },
      {
        title: "Nebula UI Kit",
        category: "Mobile Design",
        description: "A comprehensive UI kit for mobile applications with high-end CSS styling and optimized performance.",
        img: "https://picsum.photos/seed/neb/800/600",
        color: "purple",
        role: "UI/UX Designer",
        timeline: "February 2026",
        goals: ["Create a versatile UI kit", "Implement high-end CSS styling"],
        techStack: [{ name: "React", iconType: "Code" }, { name: "Framer Motion", iconType: "Layers" }]
      },
      {
        title: "Ether Dashboard",
        category: "Web Application",
        description: "A sleek dashboard for a data analytics platform with real-time data visualization.",
        img: "https://picsum.photos/seed/eth/800/600",
        color: "cyan",
        role: "Full Stack Developer",
        timeline: "January 2026",
        goals: ["Optimize for search engines (SEO)", "Build a real-time dashboard"],
        techStack: [{ name: "Node.js", iconType: "Code" }, { name: "MongoDB", iconType: "Layers" }]
      }
    ];
    
    await Project.deleteMany({}); // Clear existing
    const projects = await Project.insertMany(sampleProjects);
    res.status(201).json({ success: true, data: projects });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal Server Error', 
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

async function startServer() {
  console.log('Starting server initialization...');
  
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    console.log('Setting up Vite middleware...');
    try {
      const vite = await createViteServer({
        server: { 
          middlewareMode: true,
          hmr: false // Explicitly disable HMR to avoid websocket issues
        },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('Vite middleware set up.');
    } catch (err) {
      console.error('Failed to create Vite server:', err);
    }
  } else {
    console.log('Setting up production static file serving...');
    // Serve static files in production
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel
export default app;

// Only start the server if not on Vercel (local dev)
if (!process.env.VERCEL) {
  startServer();
}
