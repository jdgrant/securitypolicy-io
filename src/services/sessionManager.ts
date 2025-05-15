import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { ensureConnection } from './databaseService';
import sql from 'mssql';

const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

interface Session {
  sessionId: string;
  userId: string;
  refreshToken: string;
  expiresAt: Date;
  isRevoked: boolean;
}

class SessionManager {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;

  constructor() {
    this.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || uuidv4();
    this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || uuidv4();
  }

  async createSession(userId: string, email: string, role: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload: TokenPayload = { userId, email, role };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken();

    const pool = await ensureConnection();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await pool.request()
      .input('SessionId', sql.UniqueIdentifier, uuidv4())
      .input('UserId', sql.UniqueIdentifier, userId)
      .input('RefreshToken', sql.NVarChar, refreshToken)
      .input('ExpiresAt', sql.DateTime2, expiresAt)
      .query(`
        INSERT INTO Sessions (SessionId, UserId, RefreshToken, ExpiresAt, IsRevoked)
        VALUES (@SessionId, @UserId, @RefreshToken, @ExpiresAt, 0)
      `);

    return { accessToken, refreshToken };
  }

  private generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.accessTokenSecret, { expiresIn: ACCESS_TOKEN_EXPIRY });
  }

  private generateRefreshToken(): string {
    return uuidv4();
  }

  async refreshAccessToken(refreshToken: string): Promise<string | null> {
    try {
      const pool = await ensureConnection();
      const result = await pool.request()
        .input('RefreshToken', sql.NVarChar, refreshToken)
        .input('Now', sql.DateTime2, new Date())
        .query(`
          SELECT s.*, u.Email, u.RoleId
          FROM Sessions s
          JOIN Users u ON s.UserId = u.UserId
          WHERE s.RefreshToken = @RefreshToken
          AND s.ExpiresAt > @Now
          AND s.IsRevoked = 0
        `);

      const session = result.recordset[0];
      if (!session) {
        return null;
      }

      const payload: TokenPayload = {
        userId: session.UserId,
        email: session.Email,
        role: session.RoleId.toString()
      };

      return this.generateAccessToken(payload);
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return null;
    }
  }

  async revokeSession(refreshToken: string): Promise<boolean> {
    try {
      const pool = await ensureConnection();
      const result = await pool.request()
        .input('RefreshToken', sql.NVarChar, refreshToken)
        .query(`
          UPDATE Sessions
          SET IsRevoked = 1
          WHERE RefreshToken = @RefreshToken
        `);

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error revoking session:', error);
      return false;
    }
  }

  async revokeAllUserSessions(userId: string): Promise<boolean> {
    try {
      const pool = await ensureConnection();
      const result = await pool.request()
        .input('UserId', sql.UniqueIdentifier, userId)
        .query(`
          UPDATE Sessions
          SET IsRevoked = 1
          WHERE UserId = @UserId
        `);

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error revoking user sessions:', error);
      return false;
    }
  }

  verifyAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.accessTokenSecret) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  async cleanupExpiredSessions(): Promise<void> {
    try {
      const pool = await ensureConnection();
      await pool.request()
        .input('Now', sql.DateTime2, new Date())
        .query(`
          DELETE FROM Sessions
          WHERE ExpiresAt < @Now OR IsRevoked = 1
        `);
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error);
    }
  }
}

export const sessionManager = new SessionManager(); 