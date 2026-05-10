import ReactDOM from "react-dom/client"
import React from "react"

import { BrowserRouter } from "react-router-dom"

import App from "./App"
import "./index.css"

import { PetsProvider } from "./providers/PetsProvider"
import { AuthProvider } from "./providers/AuthProvider"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PetsProvider>
          <App />
        </PetsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)

