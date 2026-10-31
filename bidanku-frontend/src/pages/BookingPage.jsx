import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import VisitCalendar from '../components/VisitCalendar';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';
import { useAuth } from '../context/AuthContext';

const statusWarna = {
  menunggu: { bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
  dikonfirmasi: { bg: '#dcfce7', color: '#166534', dot: '#22c55e' },
  selesai: { bg: '#dbeafe', color: '#1e40af', dot: '#3b82f6' },
  dibatalkan: { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
};

function Badge({ status }) {
  const w = statusWarna[status] || { bg: '#f1f5f9', color: '#475569' };
  return <span className="badge" style={{ background: w.bg, color: w.color }}>{status}</span>;
}

function formatTanggal(iso) {
  if (!iso) return '';
  const d = new Date(iso.split('T')[0] + 'T12:00:00');
  return d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

export default function BookingPage() {
  const { user } = useAuth();
  const [daftar, setDaftar] = useState([]);
  const [form, setForm] = useState({ jenis: 'kunjungan', tanggal: '', jam: '', keluhan: '', catatan: '' });
  const [pesan, setPesan] = useState('');
  const [filter, setFilter] = useState('semua');

  async function muatUlang() {
    const res = await api.get('/booking');
    setDaftar(res.data);
  }

  useEffect(() => { muatUlang(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.tanggal) {
      alert('Pilih tanggal kunjungan di kalender dulu.');
      return;
    }
    if (!form.keluhan.trim()) {
      alert('Keluhan wajib diisi.');
      return;
    }
    await api.post('/booking', form);
    setForm({ jenis: 'kunjungan', tanggal: '', jam: '', keluhan: '', catatan: '' });
    setPesan('Booking berhasil dibuat!');
    setTimeout(() => setPesan(''), 3000);
    muatUlang();
  }

  async function ubahStatus(id, status) {
    await api.patch(`/booking/${id}/status`, { status });
    muatUlang();
  }

  const isBidan = user.role === 'bidan' || user.role === 'superadmin';
  const hariIni = new Date().toISOString().split('T')[0];

  const daftarTerurut = [...daftar].sort((a, b) => new Date(`${a.tanggal?.split('T')[0]}T${a.jam}`) - new Date(`${b.tanggal?.split('T')[0]}T${b.jam}`));
  const daftarTersaring = filter === 'semua' ? daftarTerurut : daftarTerurut.filter((b) => b.status === filter);

  const totalMenunggu = daftar.filter((b) => b.status === 'menunggu').length;
  const totalHariIni = daftar.filter((b) => b.tanggal?.split('T')[0] === hariIni).length;

  const tabs = [
    { key: 'semua', label: 'Semua' },
    { key: 'menunggu', label: 'Menunggu' },
    { key: 'dikonfirmasi', label: 'Dikonfirmasi' },
    { key: 'selesai', label: 'Selesai' },
    { key: 'dibatalkan', label: 'Dibatalkan' },
  ];

  return (
    <>
      <Navbar />
      <div className="page-wrap">
        <div className="page-inner" style={{ maxWidth: isBidan ? 980 : 672 }}>
          <h1 className="page-title">Booking</h1>

          {pesan && (
            <div className="bg-teal-50 text-teal-700 text-sm px-4 py-3 rounded-xl mb-4 border border-teal-100 font-medium">
              {pesan}
            </div>
          )}

          {!isBidan && (
            <form onSubmit={handleSubmit} className="card mb-6">
              <h3 className="font-semibold text-sm mb-3">Buat booking baru</h3>

              <label className="field-label">Jenis</label>
              <select value={form.jenis} onChange={(e) => setForm({ ...form, jenis: e.target.value })} className="input-field">
                <option value="kunjungan">Kunjungan</option>
                <option value="konsultasi_online">Konsultasi Online</option>
              </select>

              <div className="mb-3">
                <VisitCalendar value={form.tanggal} onChange={(iso) => setForm({ ...form, tanggal: iso })} />
              </div>

              <label className="field-label">Jam</label>
              <input type="time" required value={form.jam} onChange={(e) => setForm({ ...form, jam: e.target.value })} className="input-field" />

              <label className="field-label">Keluhan (wajib diisi)</label>
              <input required placeholder="Contoh: mual terus, ingin kontrol rutin, dll" value={form.keluhan} onChange={(e) => setForm({ ...form, keluhan: e.target.value })} className="input-field" />

              <label className="field-label">Catatan tambahan (opsional)</label>
              <textarea placeholder="Hal lain yang perlu diketahui bidan" value={form.catatan} onChange={(e) => setForm({ ...form, catatan: e.target.value })} className="input-field" rows="3" />

              <button type="submit" className="btn-primary">Buat Booking</button>
            </form>
          )}

          {isBidan && (
            <>
              {/* ===== RINGKASAN ===== */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="card" style={{ padding: 16 }}>
                  <p className="text-xs text-slate-500 mb-1">Total booking</p>
                  <p className="text-2xl font-bold text-slate-800">{daftar.length}</p>
                </div>
                <div className="card" style={{ padding: 16, background: '#fffbeb', borderColor: '#fde68a' }}>
                  <p className="text-xs text-amber-700 mb-1">Menunggu konfirmasi</p>
                  <p className="text-2xl font-bold text-amber-700">{totalMenunggu}</p>
                </div>
                <div className="card" style={{ padding: 16, background: '#f0fdfa', borderColor: '#99f6e4' }}>
                  <p className="text-xs text-teal-700 mb-1">Jadwal hari ini</p>
                  <p className="text-2xl font-bold text-teal-700">{totalHariIni}</p>
                </div>
              </div>

              {/* ===== FILTER TABS ===== */}
              <div className="flex gap-1 mb-4 border-b border-stone-200">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setFilter(t.key)}
                    className={`text-sm px-4 py-2 font-medium transition border-b-2 -mb-px ${
                      filter === t.key ? 'border-teal-700 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ===== DAFTAR BOOKING ===== */}
          <div className="space-y-3">
            {(isBidan ? daftarTersaring : daftarTerurut).length === 0 && (
              <div className="card text-center py-10">
                <p className="text-sm text-slate-400">Tidak ada booking{isBidan && filter !== 'semua' ? ` dengan status "${filter}"` : ''}.</p>
              </div>
            )}

            {!isBidan && daftarTerurut.map((b) => (
              <div key={b.id} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-slate-700">{b.jenis === 'kunjungan' ? 'Kunjungan' : 'Konsultasi Online'} — {b.tanggal?.split('T')[0]} {b.jam?.slice(0, 5)}</p>
                    <p className="text-sm text-slate-500 mt-1"><span className="font-medium">Keluhan:</span> {b.keluhan}</p>
                    {b.catatan && <p className="text-sm text-slate-400 mt-0.5"><span className="font-medium">Catatan:</span> {b.catatan}</p>}
                  </div>
                  <Badge status={b.status} />
                </div>
              </div>
            ))}

            {isBidan && daftarTersaring.map((b) => {
              const isHariIni = b.tanggal?.split('T')[0] === hariIni;
              return (
                <div key={b.id} className="card" style={isHariIni ? { borderColor: '#5eead4', borderWidth: 1.5 } : {}}>
                  <div className="flex items-start gap-4">
                    <Avatar nama={b.nama_pasien || '?'} size={42} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm text-slate-800">{b.nama_pasien}</p>
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-stone-100 px-2 py-0.5 rounded-full">
                            <Icon name={b.jenis === 'kunjungan' ? 'pin' : 'chat'} size={11} />
                            {b.jenis === 'kunjungan' ? 'Kunjungan' : 'Konsultasi Online'}
                          </span>
                          {isHariIni && (
                            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">Hari ini</span>
                          )}
                        </div>
                        <Badge status={b.status} />
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
                        <Icon name="calendar" size={13} />
                        {formatTanggal(b.tanggal)} &middot; {b.jam?.slice(0, 5)}
                      </div>

                      <p className="text-sm text-slate-600 mt-2"><span className="font-medium text-slate-700">Keluhan:</span> {b.keluhan}</p>
                      {b.catatan && <p className="text-sm text-slate-400 mt-0.5"><span className="font-medium">Catatan:</span> {b.catatan}</p>}

                      {b.status === 'menunggu' && (
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => ubahStatus(b.id, 'dikonfirmasi')} className="btn-secondary bg-teal-700 text-white flex items-center gap-1">
                            <Icon name="check" size={13} /> Konfirmasi
                          </button>
                          <button onClick={() => ubahStatus(b.id, 'dibatalkan')} className="btn-secondary bg-red-50 text-red-600">
                            Batalkan
                          </button>
                        </div>
                      )}
                      {b.status === 'dikonfirmasi' && (
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => ubahStatus(b.id, 'selesai')} className="btn-secondary bg-blue-600 text-white flex items-center gap-1">
                            <Icon name="check" size={13} /> Tandai Selesai
                          </button>
                          <button onClick={() => ubahStatus(b.id, 'dibatalkan')} className="btn-secondary bg-red-50 text-red-600">
                            Batalkan
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
