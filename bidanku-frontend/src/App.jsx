import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilPage from './pages/ProfilPage';
import BookingPage from './pages/BookingPage';
import KehamilanPage from './pages/KehamilanPage';
import KonsultasiPage from './pages/KonsultasiPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/profil" element={<ProtectedRoute><ProfilPage /></ProtectedRoute>} />
        <Route path="/booking" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
        <Route path='/kehamilan' element={<ProtectedRoute><KehamilanPage /></ProtectedRoute>} />
        <Route path='/konsultasi' element={<ProtectedRoute><KonsultasiPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;