import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function InputHarianPage() {
  const [daftar, setDaftar] = useState([]);
  const [form, setForm] = useState({ tanggal: '', jumlah_pasien: '', pendapatan: '', catatan: '' });

  async function muatUlang() {
    const res = await api.get('/input-harian');
    setDaftar(res.data);
  }

  useEffect(() => { muatUlang(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await api.post('/input-harian', form);
    setForm({ tanggal: '', jumlah_pasien: '', pendapatan: '', catatan: '' });
    muatUlang();
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-pink-50 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-bold text-pink-600 mb-4">Input Harian</h1>

          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md mb-6">
            <label className="text-sm text-gray-600">Tanggal</label>
            <input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} className="w-full border p-2 rounded mb-2" />
            <label className="text-sm text-gray-600">Jumlah Pasien</label>
            <input type="number" value={form.jumlah_pasien} onChange={(e) => setForm({ ...form, jumlah_pasien: e.target.value })} className="w-full border p-2 rounded mb-2" />
            <label className="text-sm text-gray-600">Pendapatan (Rp)</label>
            <input type="number" value={form.pendapatan} onChange={(e) => setForm({ ...form, pendapatan: e.target.value })} className="w-full border p-2 rounded mb-2" />
            <label className="text-sm text-gray-600">Catatan</label>
            <input value={form.catatan} onChange={(e) => setForm({ ...form, catatan: e.target.value })} className="w-full border p-2 rounded mb-2" />
            <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded">Simpan</button>
          </form>

          <div className="space-y-2">
            {daftar.map((d) => (
              <div key={d.id} className="bg-white p-3 rounded-xl shadow-md flex justify-between text-sm">
                <span>{d.tanggal?.split('T')[0]}</span>
                <span>{d.jumlah_pasien} pasien</span>
                <span>Rp {d.pendapatan.toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}