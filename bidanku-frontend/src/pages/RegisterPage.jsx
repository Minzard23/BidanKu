import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function RegisterPage() {
  const [form, setForm] = useState({ nama: '', email: '', password: '', no_hp: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan.');
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-1/2 relative bg-teal-900">
        <img src="/hero-klinik.png" alt="Klinik BidanKu" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-950/80 via-teal-900/20 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <p className="text-2xl font-semibold leading-snug">Daftar sekali, pantau kehamilan dari mana saja.</p>
          <p className="text-teal-100 text-sm mt-2">Praktik Bidan Lilis</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-stone-50">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-teal-800">Daftar Akun</h1>
            <p className="text-slate-500 text-sm mt-1">Khusus untuk pasien</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4 border border-red-100">
              {error}
            </div>
          )}

          <label className="field-label">Nama Lengkap</label>
          <input name="nama" placeholder="Nama lengkap" value={form.nama} onChange={handleChange} className="input-field" />

          <label className="field-label">Email</label>
          <input name="email" type="email" placeholder="nama@email.com" value={form.email} onChange={handleChange} className="input-field" />

          <label className="field-label">Password</label>
          <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} className="input-field" />

          <label className="field-label">No. HP (opsional)</label>
          <input name="no_hp" placeholder="08xxxxxxxxxx" value={form.no_hp} onChange={handleChange} className="input-field" />

          <button type="submit" className="btn-primary mt-2">Daftar</button>

          <p className="text-sm text-center mt-6 text-slate-500">
            Sudah punya akun? <Link to="/login" className="text-teal-700 font-semibold hover:underline">Masuk</Link>
          </p>
        </form>
      </div>
    </div>
  );
}