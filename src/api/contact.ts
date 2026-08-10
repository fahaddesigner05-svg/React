import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../lib/mongodb.js';
import Message from '../models/Message.js';
import nodemailer from 'nodemailer';

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

    try {
      await sendContactNotificationEmail({ name, email, message, service, budget });
    } catch (emailErr) {
      console.error('Failed to send contact notification email:', emailErr);
    }

    return res.status(201).json({ success: true, data: newMessage });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(400).json({ success: false, error: error.message });
  }
}
