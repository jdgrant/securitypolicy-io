import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const SALT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 12;
const MAX_REPEATED_CHARS = 3;

// Common password patterns to check against
const COMMON_PATTERNS = [
  /^123456/,
  /^password/i,
  /^qwerty/i,
  /^admin/i,
  /(.)\1{3,}/  // Repeated characters
];

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];

  // Check minimum length
  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
  }

  // Check for required character types
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check for common patterns
  for (const pattern of COMMON_PATTERNS) {
    if (pattern.test(password)) {
      errors.push('Password contains a common or unsafe pattern');
      break;
    }
  }

  // Check for repeated characters
  const repeatedChars = /(.)\1{3,}/;
  if (repeatedChars.test(password)) {
    errors.push(`Password cannot contain more than ${MAX_REPEATED_CHARS} repeated characters`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const hashPassword = async (password: string): Promise<{ hash: string; salt: string }> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);
  return { hash, salt };
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateResetToken = (): string => {
  return uuidv4();
};

export const isPasswordExpired = (lastPasswordChange: Date, expiryDays: number): boolean => {
  const expiryDate = new Date(lastPasswordChange);
  expiryDate.setDate(expiryDate.getDate() + expiryDays);
  return new Date() > expiryDate;
};

export const generateVerificationCode = (): string => {
  return Math.random().toString().substring(2, 8);
}; 