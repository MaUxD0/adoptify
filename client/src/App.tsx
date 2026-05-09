import {
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "./pages/adopter/HomePage";

import PetDetailsPage from "./pages/adopter/PetDetailsPage";

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
    </Routes>
  );
}

export default App;
