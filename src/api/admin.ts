import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../lib/mongodb.js';
import Admin from '../models/Admin.js';
import nodemailer from 'nodemailer';

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
  } catch (err) {
    console.error('Nodemailer error:', err);
    return { sent: false, error: err };
  }
}

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
      const { action, username, password, code, newPassword } = body || {};

      if (action === 'forgot-password') {
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        admin.resetCode = resetCode;
        admin.resetCodeExpires = resetCodeExpires;
        await admin.save();

        const recipientEmail = process.env.EMAIL_USER || 'fahaddesigner05@gmail.com';
        const emailRes = await sendVerificationEmail(recipientEmail, resetCode);

        if (!emailRes.sent && emailRes.error) {
          console.error('Failed sending email via Nodemailer:', emailRes.error);
        }

        return res.status(200).json({
          success: true,
          message: emailRes.sent ? `OTP sent to ${recipientEmail}` : `OTP generated for ${recipientEmail}`,
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
        admin.password = newPassword;
        admin.resetCode = undefined;
        admin.resetCodeExpires = undefined;
        await admin.save();

        return res.status(200).json({ success: true, message: 'Password reset successfully' });
      }

      if (action) {
        return res.status(400).json({ success: false, error: 'Invalid action requested' });
      }

      // Default: login verification
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
