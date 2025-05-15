import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  role: string;
  created_at: string;
}

interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  created_at: string;
}

export const AdminPortal: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showNewCompanyForm, setShowNewCompanyForm] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    companyName: '',
    role: '',
    password: ''
  });
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: '',
    size: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch users
      const usersResponse = await fetch('/.netlify/functions/admin/get-users');
      const usersData = await usersResponse.json();
      setUsers(usersData);

      // Fetch companies
      const companiesResponse = await fetch('/.netlify/functions/admin/get-companies');
      const companiesData = await companiesResponse.json();
      setCompanies(companiesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/.netlify/functions/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      // Reset form and refresh data
      setNewUser({
        email: '',
        firstName: '',
        lastName: '',
        companyName: '',
        role: '',
        password: ''
      });
      setShowNewUserForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/.netlify/functions/admin/create-company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCompany),
      });

      if (!response.ok) {
        throw new Error('Failed to create company');
      }

      // Reset form and refresh data
      setNewCompany({
        name: '',
        industry: '',
        size: ''
      });
      setShowNewCompanyForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Users Section */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Users</h2>
              <button
                onClick={() => setShowNewUserForm(!showNewUserForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Add User
              </button>
            </div>
          </div>
          
          {showNewUserForm && (
            <div className="p-4 border-b border-gray-200">
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={e => setNewUser({...newUser, email: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={e => setNewUser({...newUser, password: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="First Name"
                    value={newUser.firstName}
                    onChange={e => setNewUser({...newUser, firstName: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={newUser.lastName}
                    onChange={e => setNewUser({...newUser, lastName: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={newUser.companyName}
                    onChange={e => setNewUser({...newUser, companyName: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Role"
                    value={newUser.role}
                    onChange={e => setNewUser({...newUser, role: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.companyName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Companies Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Companies</h2>
              <button
                onClick={() => setShowNewCompanyForm(!showNewCompanyForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Add Company
              </button>
            </div>
          </div>

          {showNewCompanyForm && (
            <div className="p-4 border-b border-gray-200">
              <form onSubmit={handleCreateCompany} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={newCompany.name}
                    onChange={e => setNewCompany({...newCompany, name: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Industry"
                    value={newCompany.industry}
                    onChange={e => setNewCompany({...newCompany, industry: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Company Size"
                    value={newCompany.size}
                    onChange={e => setNewCompany({...newCompany, size: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Create Company
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {companies.map(company => (
                  <tr key={company.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{company.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.industry}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.size}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(company.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}; 