import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

import HomePage from "./pages/adopter/HomePage";
import PetDetailsPage from "./pages/adopter/PetDetailsPage";

import ShelterDashboardPage from "./pages/shelter/ShelterDashboardPage";
import CreatePetPage from "./pages/shelter/CreatePetPage";
import EditPetPage from "./pages/shelter/EditPetPage";
import AdoptionRequestsPage from "./pages/shelter/AdoptionRequestsPage";

function App() {
  const { user } = useAuth();
  const isShelter = user?.role === "shelter";

  return (
    <Routes>
      {/* Raíz: redirige según el rol del usuario */}
      <Route
        path="/"
        element={
          isShelter
            ? <Navigate to="/shelter/dashboard" replace />
            : <HomePage />
        }
      />

      {/* ── RUTAS ADOPTANTE ── */}
      <Route path="/pets/:id" element={<PetDetailsPage />} />

      {/* ── RUTAS SHELTER ── */}
      <Route path="/shelter/dashboard" element={<ShelterDashboardPage />} />
      <Route path="/shelter/create-pet" element={<CreatePetPage />} />
      <Route path="/shelter/edit-pet/:id" element={<EditPetPage />} />
      <Route path="/shelter/requests" element={<AdoptionRequestsPage />} />
    </Routes>
  );
}

export default App;