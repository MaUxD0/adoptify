import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import ProtectedRoute from './ProtectedRoute'
import RoleProtectedRoute from './RoleProtectedRoute'


const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'))
const ProfilePage = lazy(() => import('../pages/shared/ProfilePage'))
const UnauthorizedPage = lazy(() => import('../pages/shared/UnauthorizedPage'))


const PetsListPage = lazy(() => import('../pages/adopter/PetsListPage'))
const ShelterDashboard = lazy(() => import('../pages/shelter/ShelterDashboard'))

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
  </div>
)

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Rutas protegidas — cualquier usuario autenticado */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Rutas solo para adoptantes */}
          <Route element={<RoleProtectedRoute allowedRoles={['adopter']} />}>
            <Route path="/pets" element={<PetsListPage />} />
            <Route path="/dashboard" element={<PetsListPage />} />
          </Route>

          {/* Rutas solo para refugios */}
          <Route element={<RoleProtectedRoute allowedRoles={['shelter']} />}>
            <Route path="/shelter" element={<ShelterDashboard />} />
          </Route>

          {/* Redirect raíz */}
          <Route path="/" element={<Navigate to="/pets" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default AppRouter
