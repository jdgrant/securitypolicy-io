const API_URL = '/.netlify/functions';

// Simple email service for development
export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const response = await fetch(`${API_URL}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, text }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to send email');
    }

    console.log('Email sent:', data.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (email: string, verificationToken: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/send-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, verificationToken }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to send verification email');
    }

    console.log('Verification email sent:', data.messageId);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}; 