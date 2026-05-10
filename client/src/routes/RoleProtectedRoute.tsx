import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { UserRole } from '../types/auth.types'

interface Props {
  allowedRoles: UserRole[]
}

const RoleProtectedRoute = ({ allowedRoles }: Props) => {
  const { user, loading } = useAuth()

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
      </div>
    )
  }

  if (!loading && !user) return <Navigate to="/login" replace />
  if (user && !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />

  return <Outlet />
}

export default RoleProtectedRoute