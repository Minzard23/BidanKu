import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilPage from './pages/ProfilPage';
import BookingPage from './pages/BookingPage';
import KehamilanPage from './pages/KehamilanPage';
import KonsultasiPage from './pages/KonsultasiPage';
import ObatPage from './pages/ObatPage';
import ArtikelPage from './pages/ArtikelPage';
import AgendaPage from './pages/AgendaPage';  
import InputHarianPage from './pages/InputHarianPage';

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
        <Route path='/obat' element={<ProtectedRoute><ObatPage /></ProtectedRoute>} />
        <Route path="/artikel" element={<ProtectedRoute><ArtikelPage /></ProtectedRoute>} />
        <Route path='/agenda' element={<ProtectedRoute><AgendaPage/></ProtectedRoute>}/>
        <Route path="/input-harian" element={<ProtectedRoute><InputHarianPage /></ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;