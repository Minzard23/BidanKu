import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function InputHarianPage() {
  const [daftar, setDaftar] = useState([]);
  const [form, setForm] = useState({ tanggal: '', jumlah_pasien: '', pendapatan: '', catatan: '' });

  async function muatUlang() {
    const res = await api.get('/input-harian');
    setDaftar(res.data);
  }

  useEffect(() => { muatUlang(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await api.post('/input-harian', form);
    setForm({ tanggal: '', jumlah_pasien: '', pendapatan: '', catatan: '' });
    muatUlang();
  }

  return (
    <>
      <Navbar />
      <div className="page-wrap">
        <div className="page-inner">
          <h1 className="page-title">Input Harian</h1>

          <form onSubmit={handleSubmit} className="card mb-6">
            <label className="field-label">Tanggal</label>
            <input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} className="input-field" />
            <label className="field-label">Jumlah Pasien</label>
            <input type="number" value={form.jumlah_pasien} onChange={(e) => setForm({ ...form, jumlah_pasien: e.target.value })} className="input-field" />
            <label className="field-label">Pendapatan (Rp)</label>
            <input type="number" value={form.pendapatan} onChange={(e) => setForm({ ...form, pendapatan: e.target.value })} className="input-field" />
            <label className="field-label">Catatan</label>
            <input value={form.catatan} onChange={(e) => setForm({ ...form, catatan: e.target.value })} className="input-field" />
            <button type="submit" className="btn-primary">Simpan</button>
          </form>

          <div className="card">
            {daftar.length === 0 && <p className="text-sm text-slate-400">Belum ada data.</p>}
            {daftar.map((d) => (
              <div key={d.id} className="flex justify-between text-sm py-2 border-b border-stone-100 last:border-0">
                <span>{d.tanggal?.split('T')[0]}</span>
                <span>{d.jumlah_pasien} pasien</span>
                <span className="font-medium">Rp {Number(d.pendapatan).toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
