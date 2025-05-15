import { ensureConnection } from './databaseService';
import sql from 'mssql';

export enum SecurityEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS',
  PASSWORD_RESET_FAILURE = 'PASSWORD_RESET_FAILURE',
  VERIFICATION_SUCCESS = 'VERIFICATION_SUCCESS',
  VERIFICATION_FAILURE = 'VERIFICATION_FAILURE',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_UNLOCKED = 'ACCOUNT_UNLOCKED',
  MFA_ENABLED = 'MFA_ENABLED',
  MFA_DISABLED = 'MFA_DISABLED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}

interface SecurityEvent {
  userId?: string;
  email?: string;
  eventType: SecurityEventType;
  ipAddress: string;
  userAgent?: string;
  details?: Record<string, any>;
}

class SecurityLogger {
  async logEvent(event: SecurityEvent): Promise<void> {
    try {
      const pool = await ensureConnection();
      await pool.request()
        .input('UserId', sql.UniqueIdentifier, event.userId)
        .input('Email', sql.NVarChar, event.email)
        .input('EventType', sql.NVarChar, event.eventType)
        .input('IpAddress', sql.NVarChar, event.ipAddress)
        .input('UserAgent', sql.NVarChar, event.userAgent)
        .input('Details', sql.NVarChar, JSON.stringify(event.details))
        .input('Timestamp', sql.DateTime2, new Date())
        .query(`
          INSERT INTO SecurityEvents (
            UserId,
            Email,
            EventType,
            IpAddress,
            UserAgent,
            Details,
            Timestamp
          )
          VALUES (
            @UserId,
            @Email,
            @EventType,
            @IpAddress,
            @UserAgent,
            @Details,
            @Timestamp
          )
        `);
    } catch (error) {
      console.error('Failed to log security event:', error);
      // Don't throw the error as logging should not break the main flow
    }
  }

  async getRecentEvents(userId: string, limit: number = 10): Promise<any[]> {
    try {
      const pool = await ensureConnection();
      const result = await pool.request()
        .input('UserId', sql.UniqueIdentifier, userId)
        .input('Limit', sql.Int, limit)
        .query(`
          SELECT TOP (@Limit)
            EventType,
            IpAddress,
            UserAgent,
            Details,
            Timestamp
          FROM SecurityEvents
          WHERE UserId = @UserId
          ORDER BY Timestamp DESC
        `);

      return result.recordset;
    } catch (error) {
      console.error('Failed to get security events:', error);
      return [];
    }
  }

  async getFailedLoginAttempts(email: string, minutes: number = 15): Promise<number> {
    try {
      const pool = await ensureConnection();
      const result = await pool.request()
        .input('Email', sql.NVarChar, email)
        .input('Minutes', sql.Int, minutes)
        .query(`
          SELECT COUNT(*) as count
          FROM SecurityEvents
          WHERE Email = @Email
          AND EventType = 'LOGIN_FAILURE'
          AND Timestamp > DATEADD(minute, -@Minutes, GETDATE())
        `);

      return result.recordset[0].count;
    } catch (error) {
      console.error('Failed to get failed login attempts:', error);
      return 0;
    }
  }
}

export const securityLogger = new SecurityLogger(); 