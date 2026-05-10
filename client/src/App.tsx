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
