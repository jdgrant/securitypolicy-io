import * as dotenv from 'dotenv';
import sql from 'mssql';

// Load environment variables
dotenv.config();

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

async function testConnection() {
  try {
    console.log('Attempting to connect to database...');
    console.log('Environment variables loaded:', {
      MSSQL_USER: process.env.MSSQL_USER,
      MSSQL_SERVER: process.env.MSSQL_SERVER,
      MSSQL_DATABASE: process.env.MSSQL_DATABASE
    });
    
    const pool = await sql.connect(config);
    
    // Test query
    const result = await pool.request().query('SELECT @@version');
    console.log('Connected successfully!');
    console.log('SQL Server version:', result.recordset[0]['']);
    
    await pool.close();
    console.log('Connection closed.');
  } catch (err) {
    console.error('Error connecting to database:', err);
  }
}

// Run the test
testConnection(); 