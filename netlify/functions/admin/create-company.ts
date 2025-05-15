import { Handler } from '@netlify/functions';
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
    const { name, industry, size } = JSON.parse(event.body || '{}');

    // Validate input
    if (!name || !industry || !size) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'All fields are required' }),
      };
    }

    // Create company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert([
        {
          name,
          industry,
          size,
        },
      ])
      .select()
      .single();

    if (companyError) {
      throw companyError;
    }

    return {
      statusCode: 201,
      body: JSON.stringify(company),
    };
  } catch (error) {
    console.error('Error creating company:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

export { handler }; 