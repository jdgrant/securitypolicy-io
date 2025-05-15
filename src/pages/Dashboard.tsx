import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  firstName: string;
  lastName: string;
  companyName: string;
  role: string;
}

interface AssessmentSummary {
  id: string;
  date: string;
  status: string;
  score: number;
  riskLevel: string;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
        
        // Fetch assessments
        const assessmentsResponse = await fetch('/api/assessments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!assessmentsResponse.ok) {
          throw new Error('Failed to fetch assessments');
        }

        const assessmentsData = await assessmentsResponse.json();
        setAssessments(assessmentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-16 w-16">
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-2xl text-gray-600">
                {userData?.firstName?.[0]}{userData?.lastName?.[0]}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {userData?.firstName}!
            </h1>
            <p className="text-gray-600">
              {userData?.role} at {userData?.companyName}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button 
          onClick={() => navigate('/assessment')}
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">New Assessment</h3>
          <p className="text-gray-600">Start a new security assessment</p>
        </button>
        <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">View Reports</h3>
          <p className="text-gray-600">Access your security reports</p>
        </button>
        <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings</h3>
          <p className="text-gray-600">Manage your account settings</p>
        </button>
      </div>

      {/* Recent Assessments */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Assessments</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {assessments.map((assessment) => (
            <div key={assessment.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Assessment {assessment.id}
                  </p>
                  <p className="text-sm text-gray-500">{assessment.date}</p>
                </div>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    assessment.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                    assessment.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {assessment.riskLevel} Risk
                  </span>
                  <span className="ml-4 text-sm text-gray-500">
                    Score: {assessment.score}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 