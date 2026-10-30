import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function BookingPage() {
  const { user } = useAuth();
  const [daftar, setDaftar] = useState([]);
  const [form, setForm] = useState({ jenis: 'kunjungan', tanggal: '', jam: '', keluhan: '' });

  async function muatUlang() {
    const res = await api.get('/booking');
    setDaftar(res.data);
  }

  useEffect(() => { muatUlang(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await api.post('/booking', form);
    setForm({ jenis: 'kunjungan', tanggal: '', jam: '', keluhan: '' });
    muatUlang();
  }

  async function ubahStatus(id, status) {
    await api.patch(`/booking/${id}/status`, { status });
    muatUlang();
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-pink-50 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-bold text-pink-600 mb-4">Booking</h1>

          {user.role === 'pasien' && (
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md mb-6">
              <select value={form.jenis} onChange={(e) => setForm({ ...form, jenis: e.target.value })} className="w-full border p-2 rounded mb-2">
                <option value="kunjungan">Kunjungan</option>
                <option value="konsultasi_online">Konsultasi Online</option>
              </select>
              <input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} className="w-full border p-2 rounded mb-2" />
              <input type="time" value={form.jam} onChange={(e) => setForm({ ...form, jam: e.target.value })} className="w-full border p-2 rounded mb-2" />
              <input placeholder="Keluhan (opsional)" value={form.keluhan} onChange={(e) => setForm({ ...form, keluhan: e.target.value })} className="w-full border p-2 rounded mb-2" />
              <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded">Buat Booking</button>
            </form>
          )}

          <div className="space-y-3">
            {daftar.map((b) => (
              <div key={b.id} className="bg-white p-4 rounded-xl shadow-md">
                {b.nama_pasien && <p className="font-semibold">{b.nama_pasien}</p>}
                <p>{b.jenis} — {b.tanggal?.split('T')[0]} {b.jam}</p>
                <p className="text-sm text-gray-500">{b.keluhan}</p>
                <p className="text-sm font-semibold text-pink-600">Status: {b.status}</p>

                {(user.role === 'bidan' || user.role === 'superadmin') && (
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => ubahStatus(b.id, 'dikonfirmasi')} className="text-xs bg-green-500 text-white px-2 py-1 rounded">Konfirmasi</button>
                    <button onClick={() => ubahStatus(b.id, 'selesai')} className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Selesai</button>
                    <button onClick={() => ubahStatus(b.id, 'dibatalkan')} className="text-xs bg-red-500 text-white px-2 py-1 rounded">Batalkan</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}