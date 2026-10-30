import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function ProfilPage() {
  const [form, setForm] = useState({
    tanggal_lahir: '', alamat: '', golongan_darah: '', riwayat_penyakit: '', alergi: '', no_hp: ''
  });
  const [pesan, setPesan] = useState('');

  useEffect(() => {
    api.get('/profil').then((res) => {
      const p = res.data.profil;
      setForm({
        tanggal_lahir: p.tanggal_lahir ? p.tanggal_lahir.split('T')[0] : '',
        alamat: p.alamat || '',
        golongan_darah: p.golongan_darah || '',
        riwayat_penyakit: p.riwayat_penyakit || '',
        alergi: p.alergi || '',
        no_hp: p.no_hp || '',
      });
    });
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await api.put('/profil', form);
    setPesan('Profil berhasil disimpan!');
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-pink-50 p-8">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto">
          <h1 className="text-xl font-bold text-pink-600 mb-4">Profil Saya</h1>
          {pesan && <p className="text-green-600 text-sm mb-3">{pesan}</p>}

          <label className="text-sm text-gray-600">Tanggal Lahir</label>
          <input type="date" name="tanggal_lahir" value={form.tanggal_lahir} onChange={handleChange} className="w-full border p-2 rounded mb-3" />

          <label className="text-sm text-gray-600">No. HP</label>
          <input name="no_hp" value={form.no_hp} onChange={handleChange} className="w-full border p-2 rounded mb-3" />

          <label className="text-sm text-gray-600">Alamat</label>
          <input name="alamat" value={form.alamat} onChange={handleChange} className="w-full border p-2 rounded mb-3" />

          <label className="text-sm text-gray-600">Golongan Darah</label>
          <input name="golongan_darah" value={form.golongan_darah} onChange={handleChange} className="w-full border p-2 rounded mb-3" />

          <label className="text-sm text-gray-600">Riwayat Penyakit</label>
          <input name="riwayat_penyakit" value={form.riwayat_penyakit} onChange={handleChange} className="w-full border p-2 rounded mb-3" />

          <label className="text-sm text-gray-600">Alergi</label>
          <input name="alergi" value={form.alergi} onChange={handleChange} className="w-full border p-2 rounded mb-4" />

          <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700">
            Simpan
          </button>
        </form>
      </div>
    </>
  );
}