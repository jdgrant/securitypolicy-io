import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import { Assessment } from './pages/Assessment'
import { Suspense, lazy } from 'react'

// Lazy load the admin test page
const AdminTest = lazy(() => import('./pages/AdminTest'));

function App() {
  console.log('App component rendering')
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Security Policy Assessment
            </h1>
          </div>
        </header>
        <main className="py-8">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/admin-test" element={<AdminTest />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  )
}

export default App
