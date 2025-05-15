import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: import.meta.env.VITE_MAILGUN_SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: import.meta.env.VITE_MAILGUN_SMTP_USER,
    pass: import.meta.env.VITE_MAILGUN_SMTP_PASS
  }
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const mailOptions = {
      from: `Security Policy.io <${import.meta.env.VITE_MAILGUN_SMTP_USER}>`,
      to,
      subject,
      text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (email: string, verificationToken: string): Promise<void> => {
  // In a real application, this would send an actual email
  // For now, we'll simulate the email sending with a console log
  console.log(`
    To: ${email}
    Subject: Verify your SecurityPolicy.io account
    
    Hello!
    
    Thank you for creating an account with SecurityPolicy.io. To access your security assessment results,
    please verify your email address by entering the following code:
    
    ${verificationToken}
    
    If you did not create this account, please ignore this email.
    
    Best regards,
    SecurityPolicy.io Team
  `);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
}; 