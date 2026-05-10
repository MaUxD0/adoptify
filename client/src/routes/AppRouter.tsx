import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MyApplications } from '../pages/adopter/MyApplications';

const HomePage = () => {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <h1>Adoptify</h1>
      <a href="/applications">
        <button>My Applications</button>
      </a>
    </main>
  );
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/applications" element={<MyApplications />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;