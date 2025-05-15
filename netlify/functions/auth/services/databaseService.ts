import sql from 'mssql';

const config: sql.config = {
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  server: process.env.MSSQL_SERVER || '',
  database: process.env.MSSQL_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

// Initialize the connection pool
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

// Ensure we're connected before any queries
export async function ensureConnection() {
  await poolConnect;
  return pool;
}

// User Operations
export async function getUserByEmail(email: string): Promise<any | null> {
  const pool = await ensureConnection();
  
  const result = await pool.request()
    .input('Email', sql.VarChar, email)
    .query('SELECT * FROM Users WHERE Email = @Email');

  return result.recordset[0] || null;
}

// Close the pool when the application shuts down
process.on('SIGINT', () => {
  pool.close();
}); 