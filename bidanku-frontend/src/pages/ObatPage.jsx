import { useState, useEffect } from 'react';
import api, { API_BASE } from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const statusWarna = {
  menunggu_konfirmasi: { bg: '#fef3c7', color: '#92400e' },
  lunas: { bg: '#dcfce7', color: '#166534' },
  dikirim: { bg: '#dbeafe', color: '#1e40af' },
  selesai: { bg: '#e0e7ff', color: '#3730a3' },
  dibatalkan: { bg: '#fee2e2', color: '#991b1b' },
};
function Badge({ status }) {
  const w = statusWarna[status] || { bg: '#f1f5f9', color: '#475569' };
  return <span className="badge" style={{ background: w.bg, color: w.color }}>{status.replaceAll('_', ' ')}</span>;
}

const FORM_KOSONG = { nama: '', deskripsi: '', harga: '', stok: '' };

export default function ObatPage() {
  const { user } = useAuth();
  const [katalog, setKatalog] = useState([]);
  const [pesananList, setPesananList] = useState([]);
  const [formObat, setFormObat] = useState(FORM_KOSONG);
  const [fileFotoObat, setFileFotoObat] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [keranjang, setKeranjang] = useState({});
  const [tahapCheckout, setTahapCheckout] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ alamat_pengiriman: '', metode_pembayaran: 'Transfer Bank' });
  const [buktiFile, setBuktiFile] = useState({});

  async function muatUlang() {
    const res = await api.get('/obat');
    setKatalog(res.data);
    const res2 = await api.get('/pesanan');
    setPesananList(res2.data);
  }

  useEffect(() => { muatUlang(); }, []);

  function mulaiEdit(obat) {
    setEditingId(obat.id);
    setFormObat({ nama: obat.nama, deskripsi: obat.deskripsi || '', harga: obat.harga, stok: obat.stok });
    setFileFotoObat(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function batalEdit() {
    setEditingId(null);
    setFormObat(FORM_KOSONG);
    setFileFotoObat(null);
  }

  async function simpanObat(e) {
    e.preventDefault();
    const data = new FormData();
    data.append('nama', formObat.nama);
    data.append('deskripsi', formObat.deskripsi);
    data.append('harga', formObat.harga);
    data.append('stok', formObat.stok);
    if (fileFotoObat) fileFotoObat.forEach((file) => data.append('foto', file));

    try {
      if (editingId) {
        await api.put(`/obat/${editingId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/obat', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      batalEdit();
      muatUlang();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan obat.');
    }
  }

  async function hapusObat(id) {
    if (!confirm('Yakin mau hapus obat ini?')) return;
    try {
      await api.delete(`/obat/${id}`);
      muatUlang();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus obat.');
    }
  }

  function ubahJumlah(obatId, jumlah) {
    setKeranjang({ ...keranjang, [obatId]: jumlah });
  }

  const itemKeranjang = Object.entries(keranjang)
    .filter(([, jumlah]) => jumlah > 0)
    .map(([obat_id, jumlah]) => {
      const obat = katalog.find((o) => o.id === Number(obat_id));
      return { obat_id: Number(obat_id), jumlah: Number(jumlah), nama: obat?.nama, harga: obat?.harga, subtotal: (obat?.harga || 0) * Number(jumlah) };
    });
  const totalKeranjang = itemKeranjang.reduce((t, i) => t + i.subtotal, 0);

  async function konfirmasiPesanan(e) {
    e.preventDefault();
    if (!checkoutForm.alamat_pengiriman.trim()) {
      alert('Alamat pengiriman wajib diisi.');
      return;
    }
    await api.post('/pesanan', {
      items: itemKeranjang.map(({ obat_id, jumlah }) => ({ obat_id, jumlah })),
      alamat_pengiriman: checkoutForm.alamat_pengiriman,
      metode_pembayaran: checkoutForm.metode_pembayaran,
    });
    setKeranjang({});
    setTahapCheckout(false);
    setCheckoutForm({ alamat_pengiriman: '', metode_pembayaran: 'Transfer Bank' });
    muatUlang();
  }

  async function ubahStatusPesanan(id, status) {
    await api.patch(`/pesanan/${id}/status`, { status });
    muatUlang();
  }

  async function uploadBukti(id) {
    const file = buktiFile[id];
    if (!file) return alert('Pilih file bukti transfer dulu.');
    const data = new FormData();
    data.append('bukti', file);
    await api.post(`/pesanan/${id}/bukti-transfer`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    muatUlang();
  }

  return (
    <>
      <Navbar />
      <div className="page-wrap">
        <div className="page-inner">
          <h1 className="page-title">Obat</h1>

          {(user.role === 'bidan' || user.role === 'superadmin') && (
            <form onSubmit={simpanObat} className="card mb-6">
              <h3 className="font-semibold text-sm mb-3">{editingId ? 'Edit Obat' : 'Tambah Obat Baru'}</h3>
              <label className="field-label">Nama obat</label>
              <input value={formObat.nama} onChange={(e) => setFormObat({ ...formObat, nama: e.target.value })} className="input-field" />
              <label className="field-label">Deskripsi</label>
              <input value={formObat.deskripsi} onChange={(e) => setFormObat({ ...formObat, deskripsi: e.target.value })} className="input-field" />
              <label className="field-label">Harga</label>
              <input type="number" value={formObat.harga} onChange={(e) => setFormObat({ ...formObat, harga: e.target.value })} className="input-field" />
              <label className="field-label">Stok</label>
              <input type="number" value={formObat.stok} onChange={(e) => setFormObat({ ...formObat, stok: e.target.value })} className="input-field" />
              <label className="field-label">Foto {editingId ? '(opsional, nambah baru)' : '(maks. 3)'}</label>
              <input type="file" accept="image/*" multiple onChange={(e) => setFileFotoObat([...e.target.files])} className="input-field" />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">{editingId ? 'Simpan Perubahan' : 'Tambah'}</button>
                {editingId && <button type="button" onClick={batalEdit} className="btn-secondary bg-stone-200 text-slate-700">Batal</button>}
              </div>
            </form>
          )}

          <h2 className="font-semibold text-sm text-slate-500 mb-2">Katalog Obat</h2>
          <div className="card mb-6">
            {katalog.length === 0 && <p className="text-sm text-slate-400">Belum ada obat.</p>}
            {katalog.map((o) => (
              <div key={o.id} className="flex justify-between items-center border-b border-stone-100 last:border-0 py-3">
                <div className="flex items-center gap-3">
                  {o.fotos && o.fotos.length > 0 && (
                    <div className="flex gap-1">
                      {o.fotos.map((f, i) => (
                        <img key={i} src={`${API_BASE}${f}`} className="w-12 h-12 object-cover rounded-lg" />
                      ))}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-sm">{o.nama}</p>
                    <p className="text-sm text-slate-500">Rp {Number(o.harga).toLocaleString('id-ID')} — stok {o.stok}</p>
                  </div>
                </div>

                {user.role === 'pasien' && (
                  <input
                    type="number" min="0" max={o.stok} placeholder="Jumlah"
                    value={keranjang[o.id] || ''}
                    onChange={(e) => ubahJumlah(o.id, e.target.value)}
                    className="input-field" style={{ width: 80, marginBottom: 0 }}
                  />
                )}

                {(user.role === 'bidan' || user.role === 'superadmin') && (
                  <div className="flex gap-2">
                    <button onClick={() => mulaiEdit(o)} className="btn-secondary bg-stone-100 text-slate-600">Edit</button>
                    <button onClick={() => hapusObat(o.id)} className="btn-secondary bg-red-50 text-red-600">Hapus</button>
                  </div>
                )}
              </div>
            ))}
            {user.role === 'pasien' && katalog.length > 0 && (
              <button
                onClick={() => itemKeranjang.length === 0 ? alert('Pilih minimal 1 obat dulu.') : setTahapCheckout(true)}
                className="btn-primary mt-3"
              >
                Lanjut ke Checkout
              </button>
            )}
          </div>

          {tahapCheckout && (
            <form onSubmit={konfirmasiPesanan} className="card mb-6">
              <h3 className="font-semibold text-sm mb-3">Ringkasan Pesanan</h3>
              {itemKeranjang.map((i) => (
                <div key={i.obat_id} className="flex justify-between text-sm py-1.5 border-b border-stone-100">
                  <span>{i.nama} × {i.jumlah}</span>
                  <span>Rp {i.subtotal.toLocaleString('id-ID')}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-bold py-2">
                <span>Total</span>
                <span>Rp {totalKeranjang.toLocaleString('id-ID')}</span>
              </div>

              <label className="field-label mt-2">Alamat Pengiriman</label>
              <textarea required value={checkoutForm.alamat_pengiriman} onChange={(e) => setCheckoutForm({ ...checkoutForm, alamat_pengiriman: e.target.value })} className="input-field" rows="2" placeholder="Alamat lengkap untuk pengiriman" />

              <label className="field-label">Metode Pembayaran</label>
              <select value={checkoutForm.metode_pembayaran} onChange={(e) => setCheckoutForm({ ...checkoutForm, metode_pembayaran: e.target.value })} className="input-field">
                <option value="Transfer Bank">Transfer Bank</option>
                <option value="Bayar di Tempat (COD)">Bayar di Tempat (COD)</option>
              </select>

              <div className="flex gap-2">
                <button type="submit" className="btn-primary">Konfirmasi Pesanan</button>
                <button type="button" onClick={() => setTahapCheckout(false)} className="btn-secondary bg-stone-200 text-slate-700">Batal</button>
              </div>
            </form>
          )}

          <h2 className="font-semibold text-sm text-slate-500 mb-2">Pesanan</h2>
          {pesananList.length === 0 && <p className="text-sm text-slate-400">Belum ada pesanan.</p>}
          {pesananList.map((p) => (
            <div key={p.id} className="card mb-3">
              <div className="flex justify-between items-start">
                <div>
                  {p.nama_pasien && <p className="font-semibold text-sm">{p.nama_pasien}</p>}
                  <p className="text-sm text-slate-700">Total: Rp {Number(p.total_harga).toLocaleString('id-ID')}</p>
                  {p.alamat_pengiriman && <p className="text-xs text-slate-400 mt-1">Kirim ke: {p.alamat_pengiriman}</p>}
                  {p.metode_pembayaran && <p className="text-xs text-slate-400">Bayar: {p.metode_pembayaran}</p>}
                </div>
                <Badge status={p.status} />
              </div>

              {p.bukti_transfer && (
                <img src={`${API_BASE}${p.bukti_transfer}`} className="w-24 h-24 object-cover rounded-lg mt-2" />
              )}

              {user.role === 'pasien' && p.metode_pembayaran === 'Transfer Bank' && !p.bukti_transfer && (
                <div className="flex gap-2 mt-3 items-center">
                  <input type="file" accept="image/*" onChange={(e) => setBuktiFile({ ...buktiFile, [p.id]: e.target.files[0] })} className="text-xs" />
                  <button onClick={() => uploadBukti(p.id)} className="btn-secondary bg-teal-700 text-white">Upload Bukti Transfer</button>
                </div>
              )}

              {(user.role === 'bidan' || user.role === 'superadmin') && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => ubahStatusPesanan(p.id, 'lunas')} className="btn-secondary bg-teal-600 text-white">Lunas</button>
                  <button onClick={() => ubahStatusPesanan(p.id, 'dikirim')} className="btn-secondary bg-blue-600 text-white">Dikirim</button>
                  <button onClick={() => ubahStatusPesanan(p.id, 'selesai')} className="btn-secondary bg-slate-600 text-white">Selesai</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
