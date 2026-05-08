import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PetsProvider } from "./providers/PetsProvider";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PetsProvider>
      <App />
    </PetsProvider>
  </StrictMode>,
)
