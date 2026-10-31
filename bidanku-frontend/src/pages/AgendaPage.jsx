import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function AgendaPage() {
  const { user } = useAuth();
  const [daftar, setDaftar] = useState([]);
  const [form, setForm] = useState({ judul: '', deskripsi: '', tanggal: '', jam: '', lokasi: '' });
  const [fileFoto, setFileFoto] = useState(null);

  async function muatUlang() {
    const res = await api.get('/agenda');
    setDaftar(res.data);
  }

  useEffect(() => { muatUlang(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (fileFoto) data.append('foto', fileFoto);

    await api.post('/agenda', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    setForm({ judul: '', deskripsi: '', tanggal: '', jam: '', lokasi: '' });
    setFileFoto(null);
    muatUlang();
  }

  return (
    <>
      <Navbar />
      <div className="legacy-page" id="main-content">
        <div className="page-inner">
          <h1 className="page-title">Agenda</h1>

          {(user.role === 'bidan' || user.role === 'superadmin') && (
            <form onSubmit={handleSubmit} className="card mb-6">
              <h3 className="font-semibold text-sm mb-3">Publikasikan agenda</h3>
              <label className="field-label">Judul</label>
              <input value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} className="input-field" />
              <label className="field-label">Deskripsi</label>
              <textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} className="input-field" rows="3" />
              <label className="field-label">Tanggal</label>
              <input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} className="input-field" />
              <label className="field-label">Jam</label>
              <input type="time" value={form.jam} onChange={(e) => setForm({ ...form, jam: e.target.value })} className="input-field" />
              <label className="field-label">Lokasi</label>
              <input value={form.lokasi} onChange={(e) => setForm({ ...form, lokasi: e.target.value })} className="input-field" />
              <label className="field-label">Foto Dokumentasi (wajib)</label>
              <input type="file" accept="image/*" required onChange={(e) => setFileFoto(e.target.files[0])} className="input-field" />
              <button type="submit" className="btn-primary">Publikasikan</button>
            </form>
          )}

          <div className="space-y-3">
            {daftar.length === 0 && <p className="text-sm text-slate-400">Belum ada agenda.</p>}
            {daftar.map((a) => (
              <div key={a.id} className="card" style={{ display: 'flex', gap: 14 }}>
                {a.foto && (
                  <img src={`http://localhost:5000${a.foto}`} className="rounded-xl object-cover flex-shrink-0" style={{ width: 90, height: 90 }} />
                )}
                <div>
                  <h2 className="font-semibold text-teal-800">{a.judul}</h2>
                  <p className="text-sm text-slate-500">{a.tanggal?.split('T')[0]} {a.jam?.slice(0,5)} — {a.lokasi}</p>
                  {a.deskripsi && <p className="text-sm text-slate-700 mt-1">{a.deskripsi}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
