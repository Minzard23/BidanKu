import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const menuPasien = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/profil', label: 'Profil' },
    { to: '/booking', label: 'Booking' },
    { to: '/kehamilan', label: 'Kehamilan' },
    { to: '/konsultasi', label: 'Konsultasi' },
    { to: '/obat', label: 'Obat' },
    { to: '/artikel', label: 'Artikel' },
    { to: '/agenda', label: 'Agenda' },
  ];

  const menuBidan = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/booking', label: 'Booking' },
    { to: '/kehamilan', label: 'Kehamilan' },
    { to: '/konsultasi', label: 'Konsultasi' },
    { to: '/obat', label: 'Obat' },
    { to: '/artikel', label: 'Artikel' },
    { to: '/agenda', label: 'Agenda' },
    { to: '/input-harian', label: 'Input Harian' },
  ];

  const menu = user.role === 'pasien' ? menuPasien : menuBidan;

  return (
    <nav className="bg-pink-600 text-white px-4 py-3 flex flex-wrap gap-4 items-center">
      <span className="font-bold mr-4">BidanKu</span>
      {menu.map((m) => (
        <Link key={m.to} to={m.to} className="text-sm hover:underline">
          {m.label}
        </Link>
      ))}
      <button onClick={logout} className="text-sm ml-auto hover:underline">
        Logout
      </button>
    </nav>
  );
}