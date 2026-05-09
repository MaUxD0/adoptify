import {
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "./pages/adopter/HomePage";

import PetDetailsPage from "./pages/adopter/PetDetailsPage";

import CreatePetPage from "./pages/shelter/CreatePetPage";

import EditPetPage from "./pages/shelter/EditPetPage";


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
      <Route
      path="/shelter/edit-pet/:id"
      element={<EditPetPage />}
      />
    </Routes>
  );
}

export default App;
