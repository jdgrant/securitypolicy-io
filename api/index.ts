import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAILGUN_SMTP_HOST || 'smtp.mailgun.org',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILGUN_SMTP_USER || '',
    pass: process.env.MAILGUN_SMTP_PASS || ''
  }
});

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    const mailOptions = {
      from: `Security Policy.io <${process.env.MAILGUN_SMTP_USER}>`,
      to,
      subject,
      text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

// Verification email endpoint
app.post('/api/send-verification', async (req, res) => {
  try {
    const { email, verificationToken } = req.body;

    const mailOptions = {
      from: `Security Policy.io <${process.env.MAILGUN_SMTP_USER}>`,
      to: email,
      subject: 'Verify your SecurityPolicy.io account',
      text: `
Hello!

Thank you for creating an account with SecurityPolicy.io. To access your security assessment results,
please verify your email address by entering the following code:

${verificationToken}

If you did not create this account, please ignore this email.

Best regards,
SecurityPolicy.io Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({ success: false, error: 'Failed to send verification email' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 