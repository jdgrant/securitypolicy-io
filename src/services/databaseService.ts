import sql from 'mssql';
import type { User, Assessment, AssessmentAnswer, RiskArea } from '../types/database';

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
async function ensureConnection() {
  await poolConnect;
  return pool;
}

// User Operations
export async function createUser(userData: Omit<User, 'UserId' | 'CreatedAt' | 'UpdatedAt'>): Promise<User> {
  const pool = await ensureConnection();
  
  const result = await pool.request()
    .input('Email', sql.VarChar, userData.Email)
    .input('FirstName', sql.VarChar, userData.FirstName)
    .input('LastName', sql.VarChar, userData.LastName)
    .input('CompanyName', sql.VarChar, userData.CompanyName)
    .input('JobTitle', sql.VarChar, userData.JobTitle)
    .input('PhoneNumber', sql.VarChar, userData.PhoneNumber)
    .input('IsEmailVerified', sql.Bit, userData.IsEmailVerified)
    .input('VerificationToken', sql.VarChar, userData.VerificationToken)
    .query(`
      INSERT INTO Users (Email, FirstName, LastName, CompanyName, JobTitle, PhoneNumber, IsEmailVerified, VerificationToken)
      OUTPUT INSERTED.*
      VALUES (@Email, @FirstName, @LastName, @CompanyName, @JobTitle, @PhoneNumber, @IsEmailVerified, @VerificationToken)
    `);

  return result.recordset[0];
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const pool = await ensureConnection();
  
  const result = await pool.request()
    .input('Email', sql.VarChar, email)
    .query('SELECT * FROM Users WHERE Email = @Email');

  return result.recordset[0] || null;
}

// Assessment Operations
export async function createAssessment(
  userId: string,
  answers: AssessmentAnswer[],
  score: number,
  recommendations: string[],
  riskAreas: RiskArea[]
): Promise<Assessment> {
  const pool = await ensureConnection();
  
  const result = await pool.request()
    .input('UserId', sql.VarChar, userId)
    .input('Answers', sql.NVarChar(sql.MAX), JSON.stringify(answers))
    .input('Score', sql.Float, score)
    .input('Recommendations', sql.NVarChar(sql.MAX), JSON.stringify(recommendations))
    .input('RiskAreas', sql.NVarChar(sql.MAX), JSON.stringify(riskAreas))
    .query(`
      INSERT INTO Assessments (UserId, Answers, Score, Recommendations, RiskAreas, CompletedAt)
      OUTPUT INSERTED.*
      VALUES (@UserId, @Answers, @Score, @Recommendations, @RiskAreas, GETDATE())
    `);

  return result.recordset[0];
}

export async function getAssessmentsByUserId(userId: string): Promise<Assessment[]> {
  const pool = await ensureConnection();
  
  const result = await pool.request()
    .input('UserId', sql.VarChar, userId)
    .query('SELECT * FROM Assessments WHERE UserId = @UserId ORDER BY CreatedAt DESC');

  return result.recordset;
}

// Helper function to parse JSON fields from Assessment
export function parseAssessment(assessment: Assessment): {
  answers: AssessmentAnswer[];
  recommendations: string[];
  riskAreas: RiskArea[];
} {
  return {
    answers: JSON.parse(assessment.Answers),
    recommendations: JSON.parse(assessment.Recommendations),
    riskAreas: JSON.parse(assessment.RiskAreas)
  };
}

// Close the pool when the application shuts down
process.on('SIGINT', () => {
  pool.close();
}); 