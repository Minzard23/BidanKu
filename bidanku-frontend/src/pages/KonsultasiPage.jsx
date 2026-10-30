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
      <div className="min-h-screen bg-pink-50 p-8">
        <div className="max-w-2xl mx-auto flex gap-4">
          {user.role !== 'pasien' && (
            <div className="bg-white rounded-xl shadow-md p-3 w-48">
              <h2 className="font-semibold text-sm mb-2">Pasien</h2>
              {daftarPasien.map((p) => (
                <button
                  key={p.pasien_id}
                  onClick={() => setPasienAktif(p.pasien_id)}
                  className={`block w-full text-left text-sm p-2 rounded mb-1 ${pasienAktif === p.pasien_id ? 'bg-pink-100' : ''}`}
                >
                  {p.nama} {p.belum_dibaca > 0 && <span className="text-red-500">({p.belum_dibaca})</span>}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 bg-white rounded-xl shadow-md p-4 flex flex-col h-96">
            <div className="flex-1 overflow-y-auto mb-3">
              {pesanList.map((p) => (
                <div key={p.id} className={`mb-2 ${p.pengirim_id === user.id ? 'text-right' : ''}`}>
                  <span className={`inline-block px-3 py-1 rounded-lg text-sm ${p.pengirim_id === user.id ? 'bg-pink-500 text-white' : 'bg-gray-100'}`}>
                    {p.pesan}
                  </span>
                </div>
              ))}
            </div>
            <form onSubmit={kirim} className="flex gap-2">
              <input value={pesanBaru} onChange={(e) => setPesanBaru(e.target.value)} className="flex-1 border p-2 rounded" placeholder="Tulis pesan..." />
              <button type="submit" className="bg-pink-600 text-white px-4 rounded">Kirim</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}