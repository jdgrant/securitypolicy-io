import { Handler } from '@netlify/functions';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const handler: Handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    const { email, password } = JSON.parse(event.body || '{}');

    // Validate input
    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Email and password are required' }),
      };
    }

    // Get user from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (userError || !user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials' }),
      };
    }

    // Check password
    const validPassword = await compare(password, user.password_hash);
    if (!validPassword) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials' }),
      };
    }

    // Generate MFA code and send it
    const mfaCode = Math.floor(100000 + Math.random() * 900000).toString();
    const mfaExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store MFA code in database
    const { error: mfaError } = await supabase
      .from('mfa_codes')
      .upsert({
        user_id: user.id,
        code: mfaCode,
        expires_at: mfaExpiry.toISOString(),
      });

    if (mfaError) {
      console.error('Error storing MFA code:', mfaError);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error generating MFA code' }),
      };
    }

    // Send MFA code via email
    // TODO: Implement email sending
    console.log('MFA code for testing:', mfaCode);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'MFA code sent',
        userId: user.id,
      }),
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

export { handler }; 