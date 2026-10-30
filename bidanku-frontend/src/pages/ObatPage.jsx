import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function ObatPage() {
  const { user } = useAuth();
  const [katalog, setKatalog] = useState([]);
  const [pesananList, setPesananList] = useState([]);
  const [formObat, setFormObat] = useState({ nama: '', deskripsi: '', harga: '', stok: '' });
  const [keranjang, setKeranjang] = useState({});
  const [fileFoto, setFileFoto] = useState(null);

  async function muatUlang() {
    const res = await api.get('/obat');
    setKatalog(res.data);
    const res2 = await api.get('/pesanan');
    setPesananList(res2.data);
  }

  useEffect(() => { muatUlang(); }, []);

  async function tambahObat(e) {
  e.preventDefault();
  const data = new FormData();
  data.append('nama', formObat.nama);
  data.append('deskripsi', formObat.deskripsi);
  data.append('harga', formObat.harga);
  data.append('stok', formObat.stok);
  if (fileFoto) data.append('foto', fileFoto);

  await api.post('/obat', data, { headers: { 'Content-Type': 'multipart/form-data' } });
  setFormObat({ nama: '', deskripsi: '', harga: '', stok: '' });
  setFileFoto(null);
  muatUlang();
}

  function ubahJumlah(obatId, jumlah) {
    setKeranjang({ ...keranjang, [obatId]: jumlah });
  }

  async function buatPesanan() {
    const items = Object.entries(keranjang)
      .filter(([, jumlah]) => jumlah > 0)
      .map(([obat_id, jumlah]) => ({ obat_id: Number(obat_id), jumlah: Number(jumlah) }));
    if (items.length === 0) return alert('Pilih minimal 1 obat.');
    await api.post('/pesanan', { items });
    setKeranjang({});
    muatUlang();
  }

  async function ubahStatusPesanan(id, status) {
    await api.patch(`/pesanan/${id}/status`, { status });
    muatUlang();
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-pink-50 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-bold text-pink-600 mb-4">Obat</h1>

          {(user.role === 'bidan' || user.role === 'superadmin') && (
            <form onSubmit={tambahObat} className="bg-white p-4 rounded-xl shadow-md mb-6">
              <h2 className="font-semibold mb-2">Tambah Obat Baru</h2>
              <input placeholder="Nama obat" value={formObat.nama} onChange={(e) => setFormObat({ ...formObat, nama: e.target.value })} className="w-full border p-2 rounded mb-2" />
              <input placeholder="Deskripsi" value={formObat.deskripsi} onChange={(e) => setFormObat({ ...formObat, deskripsi: e.target.value })} className="w-full border p-2 rounded mb-2" />
              <input type="number" placeholder="Harga" value={formObat.harga} onChange={(e) => setFormObat({ ...formObat, harga: e.target.value })} className="w-full border p-2 rounded mb-2" />
              <input type="file" accept="image/*" onChange={(e) => setFileFoto(e.target.files[0])} className="w-full border p-2 rounded mb-2" />
              <input type="number" placeholder="Stok" value={formObat.stok} onChange={(e) => setFormObat({ ...formObat, stok: e.target.value })} className="w-full border p-2 rounded mb-2" />
              <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded">Tambah</button>
            </form>
          )}

          <h2 className="font-semibold mb-2">Katalog Obat</h2>
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            {katalog.map((o) => (
              <div key={o.id} className="flex justify-between items-center border-b py-2">
                <div>
                    {o.foto && <img src={`http://localhost:5000${o.foto}`} className="w-12 h-12 object-cover rounded mr-3" />}
                  <p className="font-medium">{o.nama}</p>
                  <p className="text-sm text-gray-500">Rp {o.harga.toLocaleString('id-ID')} — stok {o.stok}</p>
                </div>
                {user.role === 'pasien' && (
                  <input
                    type="number"
                    min="0"
                    placeholder="Jumlah"
                    value={keranjang[o.id] || ''}
                    onChange={(e) => ubahJumlah(o.id, e.target.value)}
                    className="border p-1 rounded w-20"
                  />
                )}
              </div>
            ))}
            {user.role === 'pasien' && (
              <button onClick={buatPesanan} className="w-full bg-pink-600 text-white py-2 rounded mt-3">
                Pesan Sekarang
              </button>
            )}
          </div>

          <h2 className="font-semibold mb-2">Pesanan</h2>
          {pesananList.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-xl shadow-md mb-3">
              {p.nama_pasien && <p className="font-semibold">{p.nama_pasien}</p>}
              <p>Total: Rp {p.total_harga.toLocaleString('id-ID')}</p>
              <p className="text-sm font-semibold text-pink-600">Status: {p.status}</p>
              {(user.role === 'bidan' || user.role === 'superadmin') && (
                <div className="flex gap-2 mt-2">
                  <button onClick={() => ubahStatusPesanan(p.id, 'lunas')} className="text-xs bg-green-500 text-white px-2 py-1 rounded">Lunas</button>
                  <button onClick={() => ubahStatusPesanan(p.id, 'dikirim')} className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Dikirim</button>
                  <button onClick={() => ubahStatusPesanan(p.id, 'selesai')} className="text-xs bg-gray-500 text-white px-2 py-1 rounded">Selesai</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}