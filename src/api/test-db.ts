import type { Handler } from '@netlify/functions';
import sql from 'mssql';

const handler: Handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  const config = {
    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASSWORD,
    server: process.env.MSSQL_SERVER || '',
    database: process.env.MSSQL_DATABASE,
    options: {
      encrypt: true,
      trustServerCertificate: true
    }
  };

  try {
    console.log('Attempting to connect to database...');
    const pool = await sql.connect(config);
    
    // Test query
    const result = await pool.request().query('SELECT @@version');
    const version = result.recordset[0][''];
    
    await pool.close();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Database connection successful',
        details: `SQL Server version: ${version}`
      })
    };
  } catch (error) {
    console.error('Database connection error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to connect to database',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};

export { handler }; 