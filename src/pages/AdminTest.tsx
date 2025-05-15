import React, { useState } from 'react';

interface TestResult {
  success: boolean;
  message: string;
  details?: string;
}

const AdminTest: React.FC = () => {
  const [dbTestResult, setDbTestResult] = useState<TestResult | null>(null);
  const [emailTestResult, setEmailTestResult] = useState<TestResult | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testDatabaseConnection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/.netlify/functions/test-db');
      const data = await response.json();
      setDbTestResult({
        success: data.success,
        message: data.message,
        details: data.details
      });
    } catch (error) {
      setDbTestResult({
        success: false,
        message: 'Failed to test database connection',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    setIsLoading(false);
  };

  const sendTestEmail = async () => {
    if (!testEmail) {
      setEmailTestResult({
        success: false,
        message: 'Please enter an email address'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/.netlify/functions/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: testEmail })
      });
      const data = await response.json();
      setEmailTestResult({
        success: data.success,
        message: data.message
      });
    } catch (error) {
      setEmailTestResult({
        success: false,
        message: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Test Panel</h1>

          {/* Database Test Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Database Connection Test</h2>
            <button
              onClick={testDatabaseConnection}
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              {isLoading ? 'Testing...' : 'Test Database Connection'}
            </button>
            {dbTestResult && (
              <div className={`mt-4 p-4 rounded-lg ${dbTestResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <p className="font-medium">{dbTestResult.message}</p>
                {dbTestResult.details && (
                  <p className="mt-2 text-sm">{dbTestResult.details}</p>
                )}
              </div>
            )}
          </div>

          {/* Email Test Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Test</h2>
            <div className="flex gap-4 mb-4">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter test email address"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendTestEmail}
                disabled={isLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              >
                {isLoading ? 'Sending...' : 'Send Test Email'}
              </button>
            </div>
            {emailTestResult && (
              <div className={`mt-4 p-4 rounded-lg ${emailTestResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <p className="font-medium">{emailTestResult.message}</p>
                {emailTestResult.details && (
                  <p className="mt-2 text-sm">{emailTestResult.details}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTest; 