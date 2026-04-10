import nodemailer from 'nodemailer';

// Email configuration
const EMAIL_USER = process.env.EMAIL_USER || 'fahaddesigner05@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'prduejxqowxbbidd';

/**
 * Sends a notification email when a new message is received.
 * This is a "Safe Mode" implementation: it won't crash the server if it fails.
 */
export const sendContactNotification = async (messageData: {
  name: string;
  email: string;
  message: string;
  service?: string;
  budget?: string;
}) => {
  console.log('--- Email Notification Start ---');
  console.log('Recipient:', 'fahaddesigner05@gmail.com');
  console.log('Sender Account:', EMAIL_USER);
  console.log('Has Password:', !!EMAIL_PASS);

  // Check if we have credentials
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn('Email notification skipped: Credentials not provided.');
    return;
  }

  try {
    // Use service: 'gmail' for better compatibility
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS.replace(/\s/g, ''), // Remove any spaces just in case
      },
    });

    const mailOptions = {
      from: `"Portfolio Alert" <${EMAIL_USER}>`,
      to: 'fahaddesigner05@gmail.com',
      subject: `New Message from ${messageData.name} - Portfolio`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #22d3ee; border-bottom: 2px solid #22d3ee; padding-bottom: 10px;">New Inquiry Received</h2>
          <p><strong>Name:</strong> ${messageData.name}</p>
          <p><strong>Email:</strong> ${messageData.email}</p>
          ${messageData.service ? `<p><strong>Service Requested:</strong> ${messageData.service}</p>` : ''}
          ${messageData.budget ? `<p><strong>Budget:</strong> ${messageData.budget}</p>` : ''}
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 15px;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${messageData.message}</p>
          </div>
          <p style="font-size: 12px; color: #888; margin-top: 20px;">This is an automated notification from your portfolio dashboard.</p>
        </div>
      `,
    };

    console.log('Attempting to send mail...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email notification sent successfully:', info.response);
    console.log('--- Email Notification End ---');
    return info;

  } catch (error) {
    // Catching any errors to prevent server crash
    console.error('Email service error details:', error);
    console.log('--- Email Notification Failed ---');
  }
};
