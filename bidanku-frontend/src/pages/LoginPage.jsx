import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import {useAuth} from '../context/AuthContext';

export default function LoginPage() {
    const { login } = useAuth();
    const [form, setForm] = useState ({email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/login', form);
            localStorage.setItem('token', res.data.token); 
            localStorage.setItem('user', JSON.stringify(res.data.user));
            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan.');
        }
    }

    return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-pink-600 mb-6">Login BidanKu</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

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
          className="w-full border p-2 rounded mb-4"
        />

        <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700">
          Login
        </button>

        <p className="text-sm text-center mt-4">
          Belum punya akun? <Link to="/register" className="text-pink-600">Daftar</Link>
        </p>
      </form>
    </div>
  );
}