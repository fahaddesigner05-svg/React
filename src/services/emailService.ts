import nodemailer from 'nodemailer';

// Email configuration
const EMAIL_USER = process.env.EMAIL_USER || 'fahaddesigner05@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'prdu ejxq owxb bidd';

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
  console.log('Attempting to send email notification for:', messageData.name);

  // Check if we have credentials
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn('Email notification skipped: Credentials not provided in environment variables.');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    // Verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.error('Transporter verification failed:', error);
      } else {
        console.log('Server is ready to take our messages');
      }
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

    console.log('Sending mail with options:', { to: mailOptions.to, subject: mailOptions.subject });

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email notification sent successfully:', info.response);
    return info;

  } catch (error) {
    // Catching any errors to prevent server crash
    console.error('Email service error:', error);
  }
};
