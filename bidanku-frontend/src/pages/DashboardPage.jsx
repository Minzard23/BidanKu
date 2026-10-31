import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <div className="page-wrap">
        <div className="page-inner" style={{ maxWidth: 900 }}>
          {user.role === 'pasien' ? <DashboardPasien user={user} /> : <DashboardBidan user={user} />}
        </div>
      </div>
    </>
  );
}

function DashboardPasien({ user }) {
  const [kehamilan, setKehamilan] = useState(null);
  const [pemeriksaan, setPemeriksaan] = useState([]);
  const [bookingBerikutnya, setBookingBerikutnya] = useState(null);
  const [pesanTerakhir, setPesanTerakhir] = useState(null);
  const [artikel, setArtikel] = useState(null);

  useEffect(() => {
    async function muat() {
      try {
        const resK = await api.get('/kehamilan');
        const aktif = resK.data.find((k) => k.status === 'hamil') || resK.data[0];
        setKehamilan(aktif || null);
        if (aktif) {
          const resP = await api.get(`/kehamilan/${aktif.id}/pemeriksaan`);
          setPemeriksaan(resP.data);
        }
      } catch {}

      try {
        const resB = await api.get('/booking');
        const akanDatang = resB.data
          .filter((b) => b.status !== 'dibatalkan' && b.status !== 'selesai')
          .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
        setBookingBerikutnya(akanDatang[0] || null);
      } catch {}

      try {
        const resC = await api.get(`/konsultasi/${user.id}`);
        const dariBidan = resC.data.filter((p) => p.pengirim_id !== user.id);
        setPesanTerakhir(dariBidan[dariBidan.length - 1] || null);
      } catch {}

      try {
        const resA = await api.get('/artikel');
        setArtikel(resA.data[0] || null);
      } catch {}
    }
    muat();
  }, [user.id]);

  const usiaMinggu = kehamilan
    ? Math.max(0, Math.floor((new Date() - new Date(kehamilan.hpht)) / (1000 * 60 * 60 * 24 * 7)))
    : null;

  const beratList = pemeriksaan.filter((p) => p.berat_badan);
  const nilaiBerat = beratList.map((p) => Number(p.berat_badan));
  const maxBerat = Math.max(...nilaiBerat, 1);
  const minBerat = Math.min(...nilaiBerat, maxBerat);

  return (
    <>
      <div className="mb-6">
        <p className="text-xl font-bold text-slate-800">Halo, {user.nama}</p>
        <p className="text-sm text-slate-500">
          {kehamilan ? `Kehamilan ke-${kehamilan.kehamilan_ke} · ${usiaMinggu} minggu` : 'Belum ada data kehamilan tercatat'}
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <div className="card" style={{ padding: 16 }}>
          <p className="text-xs text-slate-500 mb-1">Usia kehamilan</p>
          <p className="text-xl font-bold text-slate-800">{usiaMinggu !== null ? `${usiaMinggu} minggu` : '-'}</p>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <p className="text-xs text-slate-500 mb-1">Perkiraan lahir (HPL)</p>
          <p className="text-lg font-bold text-slate-800">
            {kehamilan ? new Date(kehamilan.hpl).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
          </p>
        </div>
        <div className="card" style={{ padding: 16, background: '#f0fdfa', borderColor: '#99f6e4' }}>
          <p className="text-xs text-teal-700 mb-1">Kontrol berikutnya</p>
          <p className="text-base font-bold text-teal-800">
            {bookingBerikutnya
              ? `${new Date(bookingBerikutnya.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}, ${bookingBerikutnya.jam?.slice(0, 5)}`
              : 'Belum ada jadwal'}
          </p>
        </div>
      </div>

      <div className="card mb-4">
        <h3 className="font-semibold text-sm mb-3">Riwayat berat badan</h3>
        {beratList.length > 1 ? (
          <svg viewBox="0 0 800 110" style={{ width: '100%', height: 110 }}>
            <polyline
              points={beratList
                .map((p, i) => {
                  const x = (i / (beratList.length - 1)) * 800;
                  const y = 100 - ((Number(p.berat_badan) - minBerat) / (maxBerat - minBerat || 1)) * 85;
                  return `${x},${y}`;
                })
                .join(' ')}
              fill="none"
              stroke="#0f766e"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <p className="text-sm text-slate-400">Belum cukup data buat ditampilin grafik (minimal 2 pemeriksaan).</p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold text-sm mb-1">Pesan dari bidan</h3>
          <p className="text-sm text-slate-500">{pesanTerakhir ? pesanTerakhir.pesan : 'Belum ada pesan'}</p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-sm mb-1">Artikel terbaru</h3>
          <p className="text-sm text-slate-500">{artikel ? artikel.judul : 'Belum ada artikel'}</p>
        </div>
      </div>
    </>
  );
}

function DashboardBidan({ user }) {
  const [bookingHariIni, setBookingHariIni] = useState([]);
  const [pendapatanHariIni, setPendapatanHariIni] = useState(0);
  const [pesanBelumDibalas, setPesanBelumDibalas] = useState(0);
  const [stokMenipis, setStokMenipis] = useState([]);
  const [tren, setTren] = useState([]);

  useEffect(() => {
    async function muat() {
      const hariIni = new Date().toISOString().split('T')[0];

      try {
        const resB = await api.get('/booking');
        setBookingHariIni(resB.data.filter((b) => b.tanggal?.split('T')[0] === hariIni));
      } catch {}

      try {
        const resH = await api.get('/input-harian');
        setTren([...resH.data].reverse().slice(-7));
        const hariIniData = resH.data.find((d) => d.tanggal?.split('T')[0] === hariIni);
        setPendapatanHariIni(hariIniData ? hariIniData.pendapatan : 0);
      } catch {}

      try {
        const resK = await api.get('/konsultasi');
        setPesanBelumDibalas(resK.data.reduce((total, p) => total + Number(p.belum_dibaca || 0), 0));
      } catch {}

      try {
        const resO = await api.get('/obat');
        setStokMenipis(resO.data.filter((o) => o.stok < 10));
      } catch {}
    }
    muat();
  }, []);

  const maxPasien = Math.max(...tren.map((t) => t.jumlah_pasien), 1);
  const maxRp = Math.max(...tren.map((t) => t.pendapatan), 1);

  return (
    <>
      <div className="mb-6">
        <p className="text-xl font-bold text-slate-800">Halo, {user.nama}</p>
        <p className="text-sm text-slate-500">Ringkasan praktik hari ini</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <div className="card" style={{ padding: 16, background: '#f0fdfa', borderColor: '#99f6e4' }}>
          <p className="text-xs text-teal-700 mb-1">Pasien hari ini</p>
          <p className="text-xl font-bold text-teal-800">{bookingHariIni.length}</p>
        </div>
        <div className="card" style={{ padding: 16, background: '#f0fdfa', borderColor: '#99f6e4' }}>
          <p className="text-xs text-teal-700 mb-1">Pendapatan hari ini</p>
          <p className="text-lg font-bold text-teal-800">Rp {Number(pendapatanHariIni).toLocaleString('id-ID')}</p>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <p className="text-xs text-slate-500 mb-1">Pesan belum dibalas</p>
          <p className="text-xl font-bold text-slate-800">{pesanBelumDibalas}</p>
        </div>
      </div>

      {tren.length > 1 && (
        <div className="card mb-4">
          <h3 className="font-semibold text-sm mb-3">Tren pasien & pendapatan (7 hari terakhir)</h3>
          <svg viewBox="0 0 800 110" style={{ width: '100%', height: 110 }}>
            <polyline
              points={tren.map((t, i) => `${(i / (tren.length - 1)) * 800},${100 - (t.jumlah_pasien / maxPasien) * 85}`).join(' ')}
              fill="none" stroke="#0f766e" strokeWidth="3" strokeLinecap="round"
            />
            <polyline
              points={tren.map((t, i) => `${(i / (tren.length - 1)) * 800},${100 - (t.pendapatan / maxRp) * 85}`).join(' ')}
              fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round"
            />
          </svg>
          <div className="flex gap-4 text-xs mt-2">
            <span className="text-teal-700">● Jumlah pasien</span>
            <span className="text-amber-600">- - Pendapatan</span>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold text-sm mb-2">Jadwal booking hari ini</h3>
          {bookingHariIni.length === 0 && <p className="text-sm text-slate-400">Belum ada booking hari ini.</p>}
          {bookingHariIni.map((b) => (
            <div key={b.id} className="flex justify-between text-sm py-1.5 border-b border-stone-100 last:border-0">
              <span>{b.nama_pasien || 'Pasien'} — {b.jam?.slice(0, 5)}</span>
              <span className="text-xs font-semibold" style={{ color: b.status === 'dikonfirmasi' ? '#0f766e' : '#b45309' }}>{b.status}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 className="font-semibold text-sm mb-2">Stok obat menipis</h3>
          {stokMenipis.length === 0 && <p className="text-sm text-slate-400">Semua stok aman.</p>}
          {stokMenipis.map((o) => (
            <div key={o.id} className="flex justify-between text-sm py-1.5 border-b border-stone-100 last:border-0">
              <span>{o.nama}</span>
              <span className="text-red-600 font-semibold">{o.stok} tersisa</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
