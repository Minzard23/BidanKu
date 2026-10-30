import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function KehamilanPage() {
  const { user } = useAuth();
  const [daftar, setDaftar] = useState([]);
  const [formKehamilan, setFormKehamilan] = useState({ hpht: '', kehamilan_ke: 1 });
  const [formPeriksa, setFormPeriksa] = useState({
    idKehamilan: null, tanggal: '', usia_kehamilan_minggu: '', berat_badan: '',
    tekanan_darah: '', status_gizi: 'normal', keluhan: ''
  });
  const [pemeriksaan, setPemeriksaan] = useState({});

  async function muatUlang() {
    const res = await api.get('/kehamilan');
    setDaftar(res.data);
    for (const k of res.data) {
      const p = await api.get(`/kehamilan/${k.id}/pemeriksaan`);
      setPemeriksaan((prev) => ({ ...prev, [k.id]: p.data }));
    }
  }

  useEffect(() => { muatUlang(); }, []);

  async function handleSubmitKehamilan(e) {
    e.preventDefault();
    await api.post('/kehamilan', formKehamilan);
    setFormKehamilan({ hpht: '', kehamilan_ke: 1 });
    muatUlang();
  }

  async function handleSubmitPeriksa(e) {
    e.preventDefault();
    const { idKehamilan, ...data } = formPeriksa;
    await api.post(`/kehamilan/${idKehamilan}/pemeriksaan`, data);
    setFormPeriksa({ idKehamilan: null, tanggal: '', usia_kehamilan_minggu: '', berat_badan: '', tekanan_darah: '', status_gizi: 'normal', keluhan: '' });
    muatUlang();
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-pink-50 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-bold text-pink-600 mb-4">Data Kehamilan</h1>

          {user.role === 'pasien' && (
            <form onSubmit={handleSubmitKehamilan} className="bg-white p-4 rounded-xl shadow-md mb-6">
              <label className="text-sm text-gray-600">HPHT (Hari Pertama Haid Terakhir)</label>
              <input type="date" value={formKehamilan.hpht} onChange={(e) => setFormKehamilan({ ...formKehamilan, hpht: e.target.value })} className="w-full border p-2 rounded mb-2" />
              <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded">Catat Kehamilan Baru</button>
            </form>
          )}

          {daftar.map((k) => (
            <div key={k.id} className="bg-white p-4 rounded-xl shadow-md mb-4">
              {k.nama_pasien && <p className="font-semibold">{k.nama_pasien}</p>}
              <p>HPHT: {k.hpht?.split('T')[0]} — HPL: {k.hpl?.split('T')[0]}</p>
              <p className="text-sm text-gray-500 mb-2">Status: {k.status}</p>

              <h3 className="font-semibold text-sm mt-3 mb-1">Riwayat Pemeriksaan:</h3>
              {(pemeriksaan[k.id] || []).map((p) => (
                <div key={p.id} className="text-sm border-t pt-1 mb-1">
                  {p.tanggal?.split('T')[0]} — BB: {p.berat_badan}kg, TD: {p.tekanan_darah}, Gizi: {p.status_gizi}
                </div>
              ))}

              {(user.role === 'bidan' || user.role === 'superadmin') && (
                <button
                  onClick={() => setFormPeriksa({ ...formPeriksa, idKehamilan: k.id })}
                  className="text-xs bg-pink-500 text-white px-2 py-1 rounded mt-2"
                >
                  Catat Pemeriksaan Baru
                </button>
              )}
            </div>
          ))}

          {formPeriksa.idKehamilan && (
            <form onSubmit={handleSubmitPeriksa} className="bg-white p-4 rounded-xl shadow-md">
              <h3 className="font-semibold mb-2">Catat Pemeriksaan (ID Kehamilan: {formPeriksa.idKehamilan})</h3>
              <input type="date" placeholder="Tanggal" value={formPeriksa.tanggal} onChange={(e) => setFormPeriksa({ ...formPeriksa, tanggal: e.target.value })} className="w-full border p-2 rounded mb-2" />
              <input type="number" placeholder="Usia kehamilan (minggu)" value={formPeriksa.usia_kehamilan_minggu} onChange={(e) => setFormPeriksa({ ...formPeriksa, usia_kehamilan_minggu: e.target.value })} className="w-full border p-2 rounded mb-2" />
              <input type="number" step="0.1" placeholder="Berat badan (kg)" value={formPeriksa.berat_badan} onChange={(e) => setFormPeriksa({ ...formPeriksa, berat_badan: e.target.value })} className="w-full border p-2 rounded mb-2" />
              <input placeholder="Tekanan darah" value={formPeriksa.tekanan_darah} onChange={(e) => setFormPeriksa({ ...formPeriksa, tekanan_darah: e.target.value })} className="w-full border p-2 rounded mb-2" />
              <select value={formPeriksa.status_gizi} onChange={(e) => setFormPeriksa({ ...formPeriksa, status_gizi: e.target.value })} className="w-full border p-2 rounded mb-2">
                <option value="kurang">Kurang</option>
                <option value="normal">Normal</option>
                <option value="lebih">Lebih</option>
              </select>
              <input placeholder="Keluhan" value={formPeriksa.keluhan} onChange={(e) => setFormPeriksa({ ...formPeriksa, keluhan: e.target.value })} className="w-full border p-2 rounded mb-2" />
              <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded">Simpan Pemeriksaan</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}