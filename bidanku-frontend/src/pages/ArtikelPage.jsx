import { useState, useEffect } from 'react';
import api, { API_BASE } from '../api/axios';
import Navbar from '../components/Navbar';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';

function formatTanggal(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function ringkas(teks, panjang = 110) {
  if (!teks) return '';
  return teks.length > panjang ? teks.slice(0, panjang).trim() + '…' : teks;
}

export default function ArtikelPage() {
  const { user } = useAuth();
  const isBidan = user.role === 'bidan' || user.role === 'superadmin';
  const [daftar, setDaftar] = useState([]);
  const [form, setForm] = useState({ judul: '', konten: '' });
  const [fileFoto, setFileFoto] = useState(null);
  const [tulisDibuka, setTulisDibuka] = useState(false);
  const [dibaca, setDibaca] = useState(null);

  async function muatUlang() {
    const res = await api.get('/artikel');
    setDaftar(res.data);
  }

  useEffect(() => { muatUlang(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData();
    data.append('judul', form.judul);
    data.append('konten', form.konten);
    if (fileFoto) data.append('foto', fileFoto);

    await api.post('/artikel', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    setForm({ judul: '', konten: '' });
    setFileFoto(null);
    setTulisDibuka(false);
    muatUlang();
  }

  const unggulan = daftar[0];
  const sisanya = daftar.slice(1);

  // ===== TAMPILAN BACA ARTIKEL PENUH =====
  if (dibaca) {
    return (
      <>
        <Navbar />
        <div className="page-wrap">
          <div className="page-inner" style={{ maxWidth: 760 }}>
            <button onClick={() => setDibaca(null)} className="flex items-center gap-1.5 text-sm text-teal-700 font-medium mb-5 hover:underline">
              <Icon name="arrow" size={15} style={{ transform: 'rotate(180deg)' }} /> Kembali ke daftar artikel
            </button>

            {dibaca.gambar && (
              <img src={`${API_BASE}${dibaca.gambar}`} className="w-full rounded-2xl object-cover mb-6" style={{ height: 360 }} />
            )}

            <h1 className="text-3xl font-bold text-slate-800 leading-snug mb-3">{dibaca.judul}</h1>
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-8 pb-6 border-b border-stone-200">
              <Icon name="user" size={14} /> {dibaca.nama_bidan}
              <span>&middot;</span>
              <Icon name="clock" size={14} /> {formatTanggal(dibaca.dibuat_pada)}
            </div>

            <p className="text-base text-slate-700 leading-relaxed whitespace-pre-line">{dibaca.konten}</p>
          </div>
        </div>
      </>
    );
  }

  // ===== TAMPILAN DAFTAR (MAJALAH) =====
  return (
    <>
      <Navbar />
      <div className="page-wrap">
        <div className="page-inner" style={{ maxWidth: 1000 }}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="page-title" style={{ marginBottom: 0, paddingBottom: 0, border: 'none' }}>Artikel</h1>
            {isBidan && (
              <button onClick={() => setTulisDibuka(!tulisDibuka)} className="btn-secondary bg-teal-700 text-white px-4 py-2 flex items-center gap-1.5">
                <Icon name="plus" size={14} /> Tulis Artikel
              </button>
            )}
          </div>

          {isBidan && tulisDibuka && (
            <form onSubmit={handleSubmit} className="card mb-8">
              <h3 className="font-semibold text-sm mb-3">Tulis artikel baru</h3>
              <label className="field-label">Judul</label>
              <input value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} className="input-field" />
              <label className="field-label">Konten</label>
              <textarea value={form.konten} onChange={(e) => setForm({ ...form, konten: e.target.value })} className="input-field" rows="5" />
              <label className="field-label">Foto Dokumentasi (wajib)</label>
              <input type="file" accept="image/*" required onChange={(e) => setFileFoto(e.target.files[0])} className="input-field" />
              <button type="submit" className="btn-primary">Terbitkan</button>
            </form>
          )}

          {daftar.length === 0 && (
            <div className="card text-center py-12">
              <p className="text-sm text-slate-400">Belum ada artikel.</p>
            </div>
          )}

          {/* ===== ARTIKEL UNGGULAN ===== */}
          {unggulan && (
            <button
              onClick={() => setDibaca(unggulan)}
              className="card mb-8 text-left w-full hover:shadow-md transition"
              style={{ display: 'flex', gap: 0, padding: 0, overflow: 'hidden' }}
            >
              {unggulan.gambar && (
                <img src={`${API_BASE}${unggulan.gambar}`} style={{ width: '42%', objectFit: 'cover' }} />
              )}
              <div className="p-6 flex-1">
                <span className="inline-block text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full mb-3">Artikel Terbaru</span>
                <h2 className="text-2xl font-bold text-slate-800 leading-snug mb-2">{unggulan.judul}</h2>
                <p className="text-sm text-slate-500 mb-3">{ringkas(unggulan.konten, 180)}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Icon name="user" size={13} /> {unggulan.nama_bidan}
                  <span>&middot;</span>
                  {formatTanggal(unggulan.dibuat_pada)}
                </div>
              </div>
            </button>
          )}

          {/* ===== GRID ARTIKEL LAIN ===== */}
          {sisanya.length > 0 && (
            <>
              <h2 className="font-semibold text-sm text-slate-500 uppercase tracking-wide mb-3">Artikel Lainnya</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {sisanya.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setDibaca(a)}
                    className="card text-left hover:shadow-md transition"
                    style={{ padding: 0, overflow: 'hidden' }}
                  >
                    {a.gambar && (
                      <img src={`${API_BASE}${a.gambar}`} className="w-full object-cover" style={{ height: 150 }} />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-2">{a.judul}</h3>
                      <p className="text-xs text-slate-500 mb-3">{ringkas(a.konten)}</p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Icon name="user" size={12} /> {a.nama_bidan}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
