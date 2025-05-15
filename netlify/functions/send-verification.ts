import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAILGUN_SMTP_HOST || 'smtp.mailgun.org',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILGUN_SMTP_USER || '',
    pass: process.env.MAILGUN_SMTP_PASS || ''
  }
});

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email, verificationToken } = JSON.parse(event.body || '{}');

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
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, messageId: info.messageId })
    };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Failed to send verification email' })
    };
  }
};

export { handler }; 