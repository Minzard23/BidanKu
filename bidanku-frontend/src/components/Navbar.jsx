import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
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
    <nav className="bg-white border-b border-stone-200 px-6 py-3 flex flex-wrap items-center gap-1 sticky top-0 z-10 shadow-sm">
      <span className="font-bold text-teal-800 mr-6 text-lg">BidanKu</span>
      {menu.map((m) => {
        const aktif = location.pathname === m.to;
        return (
          <Link
            key={m.to}
            to={m.to}
            className={`text-sm px-3 py-1.5 rounded-lg transition ${
              aktif ? 'bg-teal-700 text-white font-medium' : 'text-slate-600 hover:bg-stone-100'
            }`}
          >
            {m.label}
          </Link>
        );
      })}
      <div className="ml-auto flex items-center gap-3">
        <span className="text-sm text-slate-500 hidden sm:inline">{user.nama}</span>
        <button onClick={logout} className="text-sm text-teal-700 hover:text-teal-900 font-medium">
          Logout
        </button>
      </div>
    </nav>
  );
}