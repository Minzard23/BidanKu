import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function KehamilanPage() {
  const { user } = useAuth();
  const [daftar, setDaftar] = useState([]);
  const [formKehamilan, setFormKehamilan] = useState({ hpht: '', kehamilan_ke: 1, tinggi_badan_awal: '', berat_badan_awal: '' });
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
    setFormKehamilan({ hpht: '', kehamilan_ke: 1, tinggi_badan_awal: '', berat_badan_awal: '' });
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
      <div className="page-wrap">
        <div className="page-inner">
          <h1 className="page-title">Data Kehamilan</h1>

          {user.role === 'pasien' && (
            <form onSubmit={handleSubmitKehamilan} className="card mb-6">
              <h3 className="font-semibold text-sm mb-3">Catat kehamilan baru</h3>
              <label className="field-label">HPHT (Hari Pertama Haid Terakhir)</label>
              <input type="date" required value={formKehamilan.hpht} onChange={(e) => setFormKehamilan({ ...formKehamilan, hpht: e.target.value })} className="input-field" />

              <label className="field-label">Kehamilan ke-</label>
              <input type="number" min="1" value={formKehamilan.kehamilan_ke} onChange={(e) => setFormKehamilan({ ...formKehamilan, kehamilan_ke: e.target.value })} className="input-field" />

              <label className="field-label">Tinggi Badan Awal (cm)</label>
              <input type="number" step="0.1" placeholder="Contoh: 158" value={formKehamilan.tinggi_badan_awal} onChange={(e) => setFormKehamilan({ ...formKehamilan, tinggi_badan_awal: e.target.value })} className="input-field" />

              <label className="field-label">Berat Badan Sebelum Hamil (kg)</label>
              <input type="number" step="0.1" placeholder="Contoh: 52" value={formKehamilan.berat_badan_awal} onChange={(e) => setFormKehamilan({ ...formKehamilan, berat_badan_awal: e.target.value })} className="input-field" />

              <button type="submit" className="btn-primary">Catat Kehamilan</button>
            </form>
          )}

          {daftar.map((k) => (
            <div key={k.id} className="card mb-4">
              {k.nama_pasien && <p className="font-semibold text-sm">{k.nama_pasien}</p>}
              <p className="text-sm text-slate-700">HPHT: {k.hpht?.split('T')[0]} — HPL: {k.hpl?.split('T')[0]}</p>
              {(k.tinggi_badan_awal || k.berat_badan_awal) && (
                <p className="text-sm text-slate-500">
                  {k.tinggi_badan_awal && `Tinggi: ${k.tinggi_badan_awal} cm`}
                  {k.tinggi_badan_awal && k.berat_badan_awal && ' — '}
                  {k.berat_badan_awal && `Berat awal: ${k.berat_badan_awal} kg`}
                </p>
              )}
              <p className="text-sm text-slate-400 mb-3">Status: {k.status}</p>

              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Riwayat pemeriksaan</h4>
              {(pemeriksaan[k.id] || []).length === 0 && <p className="text-sm text-slate-400">Belum ada pemeriksaan.</p>}
              {(pemeriksaan[k.id] || []).map((p) => (
                <div key={p.id} className="text-sm border-t border-stone-100 pt-2 mt-2">
                  {p.tanggal?.split('T')[0]} — BB: {p.berat_badan}kg, TD: {p.tekanan_darah}, Gizi: {p.status_gizi}
                  {p.keluhan && <span className="text-slate-400"> · {p.keluhan}</span>}
                </div>
              ))}

              {(user.role === 'bidan' || user.role === 'superadmin') && (
                <button
                  onClick={() => setFormPeriksa({ ...formPeriksa, idKehamilan: k.id })}
                  className="btn-secondary bg-teal-700 text-white mt-3"
                >
                  Catat Pemeriksaan Baru
                </button>
              )}
            </div>
          ))}

          {formPeriksa.idKehamilan && (
            <form onSubmit={handleSubmitPeriksa} className="card">
              <h3 className="font-semibold text-sm mb-3">Catat Pemeriksaan</h3>
              <label className="field-label">Tanggal</label>
              <input type="date" value={formPeriksa.tanggal} onChange={(e) => setFormPeriksa({ ...formPeriksa, tanggal: e.target.value })} className="input-field" />
              <label className="field-label">Usia kehamilan (minggu)</label>
              <input type="number" value={formPeriksa.usia_kehamilan_minggu} onChange={(e) => setFormPeriksa({ ...formPeriksa, usia_kehamilan_minggu: e.target.value })} className="input-field" />
              <label className="field-label">Berat badan (kg)</label>
              <input type="number" step="0.1" value={formPeriksa.berat_badan} onChange={(e) => setFormPeriksa({ ...formPeriksa, berat_badan: e.target.value })} className="input-field" />
              <label className="field-label">Tekanan darah</label>
              <input value={formPeriksa.tekanan_darah} onChange={(e) => setFormPeriksa({ ...formPeriksa, tekanan_darah: e.target.value })} className="input-field" />
              <label className="field-label">Status gizi</label>
              <select value={formPeriksa.status_gizi} onChange={(e) => setFormPeriksa({ ...formPeriksa, status_gizi: e.target.value })} className="input-field">
                <option value="kurang">Kurang</option>
                <option value="normal">Normal</option>
                <option value="lebih">Lebih</option>
              </select>
              <label className="field-label">Keluhan</label>
              <input value={formPeriksa.keluhan} onChange={(e) => setFormPeriksa({ ...formPeriksa, keluhan: e.target.value })} className="input-field" />
              <button type="submit" className="btn-primary">Simpan Pemeriksaan</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
