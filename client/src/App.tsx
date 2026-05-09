import {
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "./pages/adopter/HomePage";

import PetDetailsPage from "./pages/adopter/PetDetailsPage";

import CreatePetPage from "./pages/shelter/CreatePetPage";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage />}
      />

      <Route
        path="/pets/:id"
        element={<PetDetailsPage />}
      />

      <Route
        path="/shelter/create-pet"
        element={<CreatePetPage />}
      />
    </Routes>
  );
}

export default App;
