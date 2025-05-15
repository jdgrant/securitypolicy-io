import { Handler } from '@netlify/functions';
import { hashPassword, verifyPassword, generateResetToken } from './services/passwordUtils';
import { getUserByEmail, ensureConnection } from './services/databaseService';
import sql from 'mssql';

const handler: Handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const path = event.path.replace(/\/$/, '').split('/').pop();
  const body = JSON.parse(event.body || '{}');

  try {
    switch (path) {
      case 'forgot-password':
        return handleForgotPassword(body);
      case 'validate-reset-token':
        return handleValidateToken(body);
      case 'reset-password':
        return handleResetPassword(body);
      default:
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Not found' })
        };
    }
  } catch (error) {
    console.error(`Error in auth function: ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

async function handleForgotPassword(body: any) {
  const { email } = body;
  
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      // Don't reveal whether the email exists
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
      };
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

    // In a real application, send email here
    // For now, just return success
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        message: 'If an account exists with this email, a password reset link will be sent.'
      })
    };
  } catch (error) {
    console.error('Error in forgot-password:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        error: 'Failed to process password reset request' 
      })
    };
  }
}

async function handleValidateToken(body: any) {
  const { token } = body;

  try {
    const pool = await ensureConnection();
    const result = await pool.request()
      .input('Token', sql.NVarChar, token)
      .input('Now', sql.DateTime2, new Date())
      .query(`
        SELECT TOP 1 *
        FROM PasswordResetTokens
        WHERE Token = @Token
        AND ExpiresAt > @Now
        AND IsUsed = 0
      `);

    if (!result.recordset[0]) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          error: 'Invalid or expired token' 
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Error in validate-reset-token:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        error: 'Failed to validate token' 
      })
    };
  }
}

async function handleResetPassword(body: any) {
  const { token, newPassword } = body;

  try {
    const pool = await ensureConnection();
    const tokenResult = await pool.request()
      .input('Token', sql.NVarChar, token)
      .input('Now', sql.DateTime2, new Date())
      .query(`
        SELECT TOP 1 *
        FROM PasswordResetTokens
        WHERE Token = @Token
        AND ExpiresAt > @Now
        AND IsUsed = 0
      `);

    const resetToken = tokenResult.recordset[0];
    if (!resetToken) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          error: 'Invalid or expired token' 
        })
      };
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

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Error in reset-password:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        error: 'Failed to reset password' 
      })
    };
  }
}

export { handler }; 