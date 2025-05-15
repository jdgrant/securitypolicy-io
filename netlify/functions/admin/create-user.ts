import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { hash } from 'bcryptjs';

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
    const { email, password, firstName, lastName, companyName, role } = JSON.parse(event.body || '{}');

    // Validate input
    if (!email || !password || !firstName || !lastName || !companyName || !role) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'All fields are required' }),
      };
    }

    // Hash password
    const passwordHash = await hash(password, 10);

    // Create user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([
        {
          email: email.toLowerCase(),
          password_hash: passwordHash,
          first_name: firstName,
          last_name: lastName,
          company_name: companyName,
          role: role,
        },
      ])
      .select()
      .single();

    if (userError) {
      throw userError;
    }

    return {
      statusCode: 201,
      body: JSON.stringify(user),
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

export { handler }; 