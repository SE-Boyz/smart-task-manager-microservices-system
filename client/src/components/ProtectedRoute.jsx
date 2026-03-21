import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center text-on-surface">
        <div className="rounded-3xl bg-white px-6 py-4 shadow-sm border border-slate-200">
          Loading your workspace...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return children
}

export default ProtectedRoute
