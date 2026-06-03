import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { PetsProvider } from './providers/PetsProvider'
import { AuthProvider } from './providers/AuthProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PetsProvider>
          <App />
        </PetsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)


