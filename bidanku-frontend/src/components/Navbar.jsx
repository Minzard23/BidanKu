import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';
import Icon from './Icon';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  if (!user) return null;

  const menuPasien = [
    { to: '/dashboard', label: 'Dashboard', icon: 'home' },
    { to: '/booking', label: 'Booking', icon: 'calendar' },
    { to: '/kehamilan', label: 'Kehamilan', icon: 'heart' },
    { to: '/konsultasi', label: 'Konsultasi', icon: 'chat' },
    { to: '/obat', label: 'Obat', icon: 'pill' },
    { to: '/artikel', label: 'Artikel', icon: 'book' },
  ];

  const menuBidan = [
    { to: '/dashboard', label: 'Dashboard', icon: 'home' },
    { to: '/booking', label: 'Booking', icon: 'calendar' },
    { to: '/kehamilan', label: 'Kehamilan', icon: 'heart' },
    { to: '/konsultasi', label: 'Konsultasi', icon: 'chat' },
    { to: '/obat', label: 'Obat', icon: 'pill' },
    { to: '/artikel', label: 'Artikel', icon: 'book' },
    { to: '/input-harian', label: 'Input Harian', icon: 'clock' },
  ];

  const menu = user.role === 'pasien' ? menuPasien : menuBidan;

  return (
    <nav
      className="bg-white border-r border-stone-200 flex flex-col py-6 px-3"
      style={{ position: 'fixed', top: 0, left: 0, width: 220, height: '100vh', zIndex: 20 }}
    >
      <Link to="/dashboard" className="flex items-center gap-2 px-2 mb-8">
        <img src="/logo-bidanku.png" alt="BidanKu" className="h-10 w-10 rounded-full object-cover" />
        <span className="font-bold text-teal-800 text-base">BidanKu</span>
      </Link>

      <div className="flex flex-col gap-1 flex-1">
        {menu.map((m) => {
          const aktif = location.pathname === m.to;
          return (
            <Link
              key={m.to}
              to={m.to}
              className={`flex items-center gap-3 text-sm px-3 py-2.5 rounded-xl transition ${
                aktif
                  ? 'bg-teal-700 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-stone-100'
              }`}
            >
              <Icon name={m.icon} size={18} />
              {m.label}
            </Link>
          );
        })}
      </div>

      <div className="border-t border-stone-100 pt-4 mt-4">
        <Link to="/profil" className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-stone-100 transition">
          <Avatar nama={user.nama} foto={user.foto_profil} size={36} />
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate">{user.nama}</p>
            <p className="text-xs text-slate-400 capitalize">{user.role}</p>
          </div>
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 text-sm px-3 py-2.5 mt-1 rounded-xl text-red-500 hover:bg-red-50 transition w-full"
        >
          <Icon name="logout" size={18} />
          Logout
        </button>
      </div>
    </nav>
  );
}
