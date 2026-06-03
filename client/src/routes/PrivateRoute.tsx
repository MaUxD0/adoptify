import { Navigate } from 'react-router-dom'
import { LoadingState } from '../components/ui/LoadingState/LoadingState'
import { useAuth } from '../hooks/useAuth'

interface PrivateRouteProps {
  children: React.ReactNode
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingState label="Verificando sesión..." />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
