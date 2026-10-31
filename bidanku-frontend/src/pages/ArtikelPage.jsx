import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function ArtikelPage() {
  const { user } = useAuth();
  const [daftar, setDaftar] = useState([]);
  const [form, setForm] = useState({ judul: '', konten: '' });

  async function muatUlang() {
    const res = await api.get('/artikel');
    setDaftar(res.data);
  }

  useEffect(() => { muatUlang(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await api.post('/artikel', form);
    setForm({ judul: '', konten: '' });
    muatUlang();
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-pink-50 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-bold text-pink-600 mb-4">Artikel</h1>

          {(user.role === 'bidan' || user.role === 'superadmin') && (
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md mb-6">
              <input placeholder="Judul" value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} className="w-full border p-2 rounded mb-2" />
              <textarea placeholder="Konten" value={form.konten} onChange={(e) => setForm({ ...form, konten: e.target.value })} className="w-full border p-2 rounded mb-2" rows="4" />
              <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded">Terbitkan</button>
            </form>
          )}

          <div className="space-y-3">
            {daftar.map((a) => (
              <div key={a.id} className="bg-white p-4 rounded-xl shadow-md">
                <h2 className="font-semibold text-pink-600">{a.judul}</h2>
                <p className="text-xs text-gray-400 mb-2">oleh {a.nama_bidan}</p>
                <p className="text-sm text-gray-700">{a.konten}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}