import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'

import ProtectedRoute from './ProtectedRoute'
import RoleProtectedRoute from './RoleProtectedRoute'
import RootRedirect from './RootRedirect'
import ProfileRedirect from './ProfileRedirect'

const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'))
const ProfilePage = lazy(() => import('../pages/shared/ProfilePage'))
const UnauthorizedPage = lazy(() => import('../pages/shared/UnauthorizedPage'))

const PetsListPage = lazy(() => import('../pages/adopter/PetsListPage'))
const HomePage = lazy(() => import('../pages/adopter/HomePage'))
const MyApplications = lazy(() => import('../pages/adopter/MyApplications'))
const PetDetailsPage = lazy(() => import('../pages/adopter/PetDetailsPage'))
const ChatPage = lazy(() => import('../pages/adopter/ChatPage'))
const ChatsListPage = lazy(() => import('../pages/adopter/ChatListPage'))

const ShelterDashboardPage = lazy(() => import('../pages/shelter/ShelterDashboardPage'))
const ShelterProfilePage = lazy(() => import('../pages/shelter/ShelterProfilePage'))
const CreatePetPage = lazy(() => import('../pages/shelter/CreatePetPage'))
const EditPetPage = lazy(() => import('../pages/shelter/EditPetPage'))
const AdoptionRequestsPage = lazy(() => import('../pages/shelter/AdoptionRequestsPage'))

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
  </div>
)

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route path="/" element={<RootRedirect />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfileRedirect />} />
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={['ADOPTER']} />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/pets/:id" element={<PetDetailsPage />} />
          <Route path="/dashboard" element={<PetsListPage />} />
          <Route path="/applications" element={<MyApplications />} />
          <Route path="/adopter/profile" element={<ProfilePage />} />
          <Route path="/chat/:id" element={<ChatPage />} />
          <Route path="/chats" element={<ChatsListPage />} />
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={['SHELTER']} />}>
          <Route path="/shelter" element={<Navigate to="/shelter/dashboard" replace />} />
          <Route path="/shelter/dashboard" element={<ShelterDashboardPage />} />
          <Route path="/shelter/profile" element={<ShelterProfilePage />} />
          <Route path="/shelter/create-pet" element={<CreatePetPage />} />
          <Route path="/shelter/edit-pet/:id" element={<EditPetPage />} />
          <Route path="/shelter/requests" element={<AdoptionRequestsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRouter