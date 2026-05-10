import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const ProfileRedirect = () => {
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
    return <Navigate to="/shelter/profile" replace />
  }

  // Adopters y otros van a la ruta base /profile (o una específica si se prefiere)
  // Pero para evitar colisión circular, aquí renderizamos el componente real
  // o redirigimos a una ruta que NO sea la que capturamos en AppRouter.
  // En este caso, AppRouter usará este redirect para "/" y para "/profile"
  return <Navigate to="/adopter/profile" replace />
}

export default ProfileRedirect
