import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const RootRedirect = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (user.role === 'SHELTER') {
    return <Navigate to="/shelter/dashboard" replace />
  }

  return <Navigate to="/home" replace />
}

export default RootRedirect
