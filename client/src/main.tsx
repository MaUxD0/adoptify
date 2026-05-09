import React from "react";

import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

import App from "./App";

import { PetsProvider } from "./providers/PetsProvider";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <BrowserRouter>
      <PetsProvider>
        <App />
      </PetsProvider>
    </BrowserRouter>
  </React.StrictMode>
);