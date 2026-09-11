import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import PetsPage from './pages/PetsPage';
import VeterinariansPage from './pages/VeterinariansPage';
import CarePlansPage from './pages/CarePlansPage';
import UsersPage from './pages/UsersPage';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/usuarios" element={<UsersPage />} />
              <Route path="/pets" element={<PetsPage />} />
              <Route path="/veterinarios" element={<VeterinariansPage />} />
              <Route path="/care-plans" element={<CarePlansPage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
