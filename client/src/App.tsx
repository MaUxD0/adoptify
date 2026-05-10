import { Toaster } from 'react-hot-toast';
import { AdoptionProvider } from './providers/AdoptionProvider';
import { ChatProvider } from './providers/ChatProvider';
import AppRouter from './routes/AppRouter';

export default function App() {
  return (
    <AdoptionProvider>
      <ChatProvider>
        <AppRouter />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '8px',
              fontFamily: 'inherit',
            },
          }}
        />
      </ChatProvider>
    </AdoptionProvider>
  );
}
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

=======
    <AdoptionProvider>
      <ChatProvider>
        <AppRouter />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '8px',
              fontFamily: 'inherit',
            },
          }}
        />
      </ChatProvider>
    </AdoptionProvider>
  );
}
>>>>>>> d165608 (feat: adoptions frontend working + dev login endpoint)
