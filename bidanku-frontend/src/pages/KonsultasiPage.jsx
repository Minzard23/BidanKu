import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function KonsultasiPage() {
  const { user } = useAuth();
  const [daftarPasien, setDaftarPasien] = useState([]);
  const [pasienAktif, setPasienAktif] = useState(user.role === 'pasien' ? user.id : null);
  const [pesanList, setPesanList] = useState([]);
  const [pesanBaru, setPesanBaru] = useState('');

  useEffect(() => {
    if (user.role !== 'pasien') {
      api.get('/konsultasi').then((res) => setDaftarPasien(res.data));
    }
  }, []);

  useEffect(() => {
    if (!pasienAktif) return;
    muatPesan();
    const interval = setInterval(muatPesan, 5000);
    return () => clearInterval(interval);
  }, [pasienAktif]);

  async function muatPesan() {
    const res = await api.get(`/konsultasi/${pasienAktif}`);
    setPesanList(res.data);
  }

  async function kirim(e) {
    e.preventDefault();
    if (!pesanBaru.trim()) return;
    const body = user.role === 'pasien' ? { pesan: pesanBaru } : { pesan: pesanBaru, pasien_id: pasienAktif };
    await api.post('/konsultasi', body);
    setPesanBaru('');
    muatPesan();
  }

  return (
    <>
      <Navbar />
      <div className="page-wrap">
        <div className="page-inner" style={{ maxWidth: 900 }}>
          <h1 className="page-title">Konsultasi</h1>
          <div className="flex gap-4" style={{ height: 460 }}>
            {user.role !== 'pasien' && (
              <div className="card" style={{ width: 200, overflowY: 'auto', padding: 12 }}>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Pasien</p>
                {daftarPasien.length === 0 && <p className="text-sm text-slate-400">Belum ada percakapan.</p>}
                {daftarPasien.map((p) => (
                  <button
                    key={p.pasien_id}
                    onClick={() => setPasienAktif(p.pasien_id)}
                    className="block w-full text-left text-sm p-2 rounded-lg mb-1"
                    style={{ background: pasienAktif === p.pasien_id ? '#f0fdfa' : 'transparent', color: pasienAktif === p.pasien_id ? '#0f766e' : '#334155', fontWeight: pasienAktif === p.pasien_id ? 700 : 400 }}
                  >
                    {p.nama} {p.belum_dibaca > 0 && <span style={{ color: '#dc2626' }}>({p.belum_dibaca})</span>}
                  </button>
                ))}
              </div>
            )}

            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16 }}>
              <div style={{ flex: 1, overflowY: 'auto', marginBottom: 12 }}>
                {pesanList.map((p) => (
                  <div key={p.id} style={{ marginBottom: 8, textAlign: p.pengirim_id === user.id ? 'right' : 'left' }}>
                    <span
                      style={{
                        display: 'inline-block', padding: '7px 12px', borderRadius: 12, fontSize: 13.5, maxWidth: '70%',
                        background: p.pengirim_id === user.id ? '#0f766e' : '#f1f5f9',
                        color: p.pengirim_id === user.id ? '#fff' : '#1e293b',
                      }}
                    >
                      {p.pesan}
                    </span>
                  </div>
                ))}
                {pesanList.length === 0 && <p className="text-sm text-slate-400">Belum ada pesan.</p>}
              </div>
              <form onSubmit={kirim} className="flex gap-2">
                <input value={pesanBaru} onChange={(e) => setPesanBaru(e.target.value)} className="input-field" style={{ marginBottom: 0 }} placeholder="Tulis pesan..." />
                <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '10px 20px' }}>Kirim</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
