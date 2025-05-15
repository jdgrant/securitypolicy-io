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