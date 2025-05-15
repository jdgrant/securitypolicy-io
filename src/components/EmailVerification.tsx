import React, { useState } from 'react';

interface EmailVerificationProps {
  email: string;
  verificationToken: string;
  onVerificationComplete: () => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  verificationToken,
  onVerificationComplete
}) => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token === verificationToken) {
      onVerificationComplete();
    } else {
      setError('Invalid verification code. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Verify Your Email</h2>
      <p className="text-gray-600 mb-6">
        We've sent a verification code to {email}. Please enter it below to verify your email address.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Verification Code
          </label>
          <input
            type="text"
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
              setError('');
            }}
            className={`w-full px-3 py-2 border rounded-md ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter verification code"
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Verify Email
          </button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Didn't receive the code? Check your spam folder or{' '}
          <button
            onClick={() => {
              // In a real application, this would trigger sending a new verification email
              alert('A new verification code has been sent to your email.');
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            click here to resend
          </button>
        </p>
      </div>
    </div>
  );
}; 