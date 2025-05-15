import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Assessment } from './pages/Assessment'
import { ResetPassword } from './pages/ResetPassword'
import { Suspense, lazy } from 'react'
import type { ReactNode } from 'react'
import { Nav } from './components/Nav'

// Lazy load the admin test page
const AdminTest = lazy(() => import('./pages/AdminTest'));

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  console.log('App component rendering')
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <main className="pt-16">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-test"
                element={
                  <ProtectedRoute>
                    <AdminTest />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  )
}

export default App
