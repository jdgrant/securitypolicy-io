import sql from 'mssql';
import { v4 as uuidv4 } from 'uuid';
import { ensureConnection } from './databaseService';

export interface Session {
  sessionId: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export async function createSession(userId: string): Promise<Session> {
  const pool = await ensureConnection();
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Token expires in 7 days

  const result = await pool.request()
    .input('UserId', sql.UniqueIdentifier, userId)
    .input('Token', sql.NVarChar, token)
    .input('ExpiresAt', sql.DateTime2, expiresAt)
    .query(`
      INSERT INTO Sessions (UserId, Token, ExpiresAt)
      OUTPUT INSERTED.*
      VALUES (@UserId, @Token, @ExpiresAt)
    `);

  return result.recordset[0];
}

export async function getSessionByToken(token: string): Promise<Session | null> {
  const pool = await ensureConnection();
  
  const result = await pool.request()
    .input('Token', sql.NVarChar, token)
    .input('Now', sql.DateTime2, new Date())
    .query(`
      SELECT *
      FROM Sessions
      WHERE Token = @Token
      AND ExpiresAt > @Now
    `);

  return result.recordset[0] || null;
}

export async function deleteSession(token: string): Promise<void> {
  const pool = await ensureConnection();
  
  await pool.request()
    .input('Token', sql.NVarChar, token)
    .query('DELETE FROM Sessions WHERE Token = @Token');
}

export async function cleanExpiredSessions(): Promise<void> {
  const pool = await ensureConnection();
  
  await pool.request()
    .input('Now', sql.DateTime2, new Date())
    .query('DELETE FROM Sessions WHERE ExpiresAt <= @Now');
} 