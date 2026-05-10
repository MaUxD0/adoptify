import { useAuth } from './hooks/useAuth'

// Adopter
import HomePage from './pages/adopter/HomePage'
import PetDetailsPage from './pages/adopter/PetDetailsPage'

// Shelter
import ShelterDashboardPage from './pages/shelter/ShelterDashboardPage'
import CreatePetPage from './pages/shelter/CreatePetPage'
import EditPetPage from './pages/shelter/EditPetPage'
import AdoptionRequestsPage from './pages/shelter/AdoptionRequestsPage'

import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Cargando...</p>
      </div>
    )
  }

  const isShelter = user?.role === 'shelter'

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <RegisterPage />}
      />

      <Route
        path="/"
        element={
          !user ? (
            <Navigate to="/login" replace />
          ) : isShelter ? (
            <Navigate to="/shelter/dashboard" replace />
          ) : (
            <HomePage />
          )
        }
      />

      <Route
        path="/pets/:id"
        element={user ? <PetDetailsPage /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/shelter/dashboard"
        element={isShelter ? <ShelterDashboardPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/shelter/create-pet"
        element={isShelter ? <CreatePetPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/shelter/edit-pet/:id"
        element={isShelter ? <EditPetPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/shelter/requests"
        element={isShelter ? <AdoptionRequestsPage /> : <Navigate to="/login" replace />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

