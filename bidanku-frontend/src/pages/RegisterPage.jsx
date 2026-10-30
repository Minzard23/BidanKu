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
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-pink-600 mb-6">Daftar BidanKu</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          name="nama"
          placeholder="Nama lengkap"
          value={form.nama}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        />
        <input
          name="no_hp"
          placeholder="No. HP"
          value={form.no_hp}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />

        <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700">
          Daftar
        </button>

        <p className="text-sm text-center mt-4">
          Sudah punya akun? <Link to="/login" className="text-pink-600">Login</Link>
        </p>
      </form>
    </div>
  );
}