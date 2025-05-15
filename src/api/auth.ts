import { Router } from 'express';
import sql from 'mssql';
import { hashPassword, verifyPassword, generateResetToken } from '../services/passwordUtils';
import { getUserByEmail } from '../services/databaseService';
import { sendEmail } from '../services/emailService';
import { ensureConnection } from '../services/databaseService';
import { rateLimiter } from '../services/rateLimiter';
import { securityLogger, SecurityEventType } from '../services/securityLogger';
import { sessionManager } from '../services/sessionManager';

const router = Router();

// Helper function to get client IP
const getClientIp = (req: any): string => {
  return (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';
};

// Request password reset
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const ipAddress = getClientIp(req);
  const userAgent = req.headers['user-agent'] || 'unknown';

  // Check rate limit
  const rateLimitResult = rateLimiter.attempt('password-reset', ipAddress);
  if (!rateLimitResult.success) {
    await securityLogger.logEvent({
      email,
      eventType: SecurityEventType.RATE_LIMIT_EXCEEDED,
      ipAddress,
      userAgent,
      details: { type: 'password-reset' }
    });

    return res.status(429).json({
      success: false,
      error: `Too many attempts. Please try again in ${Math.ceil(rateLimitResult.msBeforeNext! / 1000)} seconds.`
    });
  }

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      // Don't reveal whether the email exists
      await securityLogger.logEvent({
        email,
        eventType: SecurityEventType.PASSWORD_RESET_REQUEST,
        ipAddress,
        userAgent,
        details: { status: 'email-not-found' }
      });
      return res.json({ success: true });
    }

    const resetToken = generateResetToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

    // Store reset token in database
    const pool = await ensureConnection();
    await pool.request()
      .input('UserId', sql.UniqueIdentifier, user.UserId)
      .input('Token', sql.NVarChar, resetToken)
      .input('ExpiresAt', sql.DateTime2, expiresAt)
      .query(`
        INSERT INTO PasswordResetTokens (UserId, Token, ExpiresAt)
        VALUES (@UserId, @Token, @ExpiresAt)
      `);

    // Send reset email
    await sendEmail(
      email,
      'Reset Your Password',
      `
To reset your password, click the following link:
${process.env.APP_URL}/reset-password?token=${resetToken}

This link will expire in 1 hour.

If you did not request this password reset, please ignore this email.
      `
    );

    await securityLogger.logEvent({
      userId: user.UserId,
      email,
      eventType: SecurityEventType.PASSWORD_RESET_REQUEST,
      ipAddress,
      userAgent,
      details: { status: 'success' }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error in forgot-password:', error);
    await securityLogger.logEvent({
      email,
      eventType: SecurityEventType.PASSWORD_RESET_FAILURE,
      ipAddress,
      userAgent,
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
    res.status(500).json({ success: false, error: 'Failed to process password reset request' });
  }
});

// Validate reset token
router.post('/validate-reset-token', async (req, res) => {
  const { token } = req.body;
  const ipAddress = getClientIp(req);
  const userAgent = req.headers['user-agent'] || 'unknown';

  try {
    const pool = await ensureConnection();
    const result = await pool.request()
      .input('Token', sql.NVarChar, token)
      .input('Now', sql.DateTime2, new Date())
      .query(`
        SELECT TOP 1 pt.*, u.Email
        FROM PasswordResetTokens pt
        JOIN Users u ON pt.UserId = u.UserId
        WHERE pt.Token = @Token
        AND pt.ExpiresAt > @Now
        AND pt.IsUsed = 0
      `);

    const resetToken = result.recordset[0];
    if (!resetToken) {
      await securityLogger.logEvent({
        eventType: SecurityEventType.PASSWORD_RESET_FAILURE,
        ipAddress,
        userAgent,
        details: { reason: 'invalid-token' }
      });
      return res.status(400).json({ success: false, error: 'Invalid or expired token' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error in validate-reset-token:', error);
    await securityLogger.logEvent({
      eventType: SecurityEventType.PASSWORD_RESET_FAILURE,
      ipAddress,
      userAgent,
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
    res.status(500).json({ success: false, error: 'Failed to validate token' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  const ipAddress = getClientIp(req);
  const userAgent = req.headers['user-agent'] || 'unknown';

  try {
    const pool = await ensureConnection();

    // Get valid token
    const tokenResult = await pool.request()
      .input('Token', sql.NVarChar, token)
      .input('Now', sql.DateTime2, new Date())
      .query(`
        SELECT TOP 1 pt.*, u.Email
        FROM PasswordResetTokens pt
        JOIN Users u ON pt.UserId = u.UserId
        WHERE pt.Token = @Token
        AND pt.ExpiresAt > @Now
        AND pt.IsUsed = 0
      `);

    const resetToken = tokenResult.recordset[0];
    if (!resetToken) {
      await securityLogger.logEvent({
        eventType: SecurityEventType.PASSWORD_RESET_FAILURE,
        ipAddress,
        userAgent,
        details: { reason: 'invalid-token' }
      });
      return res.status(400).json({ success: false, error: 'Invalid or expired token' });
    }

    // Hash new password
    const { hash, salt } = await hashPassword(newPassword);

    // Update password and mark token as used
    await pool.request()
      .input('UserId', sql.UniqueIdentifier, resetToken.UserId)
      .input('PasswordHash', sql.NVarChar, hash)
      .input('PasswordSalt', sql.NVarChar, salt)
      .input('Now', sql.DateTime2, new Date())
      .input('TokenId', sql.UniqueIdentifier, resetToken.TokenId)
      .query(`
        BEGIN TRANSACTION;
        
        UPDATE Users
        SET PasswordHash = @PasswordHash,
            PasswordSalt = @PasswordSalt,
            LastPasswordChange = @Now,
            FailedLoginAttempts = 0,
            IsLocked = 0,
            LockoutUntil = NULL
        WHERE UserId = @UserId;

        UPDATE PasswordResetTokens
        SET IsUsed = 1
        WHERE TokenId = @TokenId;

        COMMIT;
      `);

    // Revoke all existing sessions for security
    await sessionManager.revokeAllUserSessions(resetToken.UserId);

    await securityLogger.logEvent({
      userId: resetToken.UserId,
      email: resetToken.Email,
      eventType: SecurityEventType.PASSWORD_RESET_SUCCESS,
      ipAddress,
      userAgent
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error in reset-password:', error);
    await securityLogger.logEvent({
      eventType: SecurityEventType.PASSWORD_RESET_FAILURE,
      ipAddress,
      userAgent,
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
    res.status(500).json({ success: false, error: 'Failed to reset password' });
  }
});

export default router; 