import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Avatar from '../components/Avatar';
import { useAuth } from '../context/AuthContext';

export default function ProfilPage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    tanggal_lahir: '', alamat: '', golongan_darah: '', riwayat_penyakit: '', alergi: '',
    no_hp: '', nama_pasangan: '', kontak_darurat: ''
  });
  const [fotoProfil, setFotoProfil] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [pesan, setPesan] = useState('');

  useEffect(() => {
    api.get('/profil').then((res) => {
      const p = res.data.profil;
      setForm({
        tanggal_lahir: p.tanggal_lahir ? p.tanggal_lahir.split('T')[0] : '',
        alamat: p.alamat || '',
        golongan_darah: p.golongan_darah || '',
        riwayat_penyakit: p.riwayat_penyakit || '',
        alergi: p.alergi || '',
        no_hp: p.no_hp || '',
        nama_pasangan: p.nama_pasangan || '',
        kontak_darurat: p.kontak_darurat || '',
      });
      if (p.foto_profil) updateUser({ foto_profil: p.foto_profil });
    });
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFoto(e) {
    const file = e.target.files[0];
    setFotoProfil(file);
    if (file) setFotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (fotoProfil) data.append('foto_profil', fotoProfil);

    await api.put('/profil', data, { headers: { 'Content-Type': 'multipart/form-data' } });

    const res = await api.get('/profil');
    if (res.data.profil.foto_profil) updateUser({ foto_profil: res.data.profil.foto_profil });

    setPesan('Profil berhasil disimpan!');
    setTimeout(() => setPesan(''), 3000);
  }

  return (
    <>
      <Navbar />
      <div className="page-wrap">
        <div className="page-inner">
          <h1 className="page-title">Profil Saya</h1>
          <form onSubmit={handleSubmit} className="card">
            {pesan && <div className="bg-teal-50 text-teal-700 text-sm px-3 py-2 rounded-lg mb-4 border border-teal-100">{pesan}</div>}

            <div className="flex items-center gap-4 mb-5">
              <Avatar nama={user.nama} foto={fotoPreview ? null : user.foto_profil} size={64} />
              {fotoPreview && <img src={fotoPreview} className="w-16 h-16 rounded-full object-cover" />}
              <div>
                <label className="field-label" style={{ marginBottom: 4 }}>Ganti Foto Profil</label>
                <input type="file" accept="image/*" onChange={handleFoto} className="text-sm" />
              </div>
            </div>

            <h3 className="font-semibold text-sm text-slate-500 mb-2">Data Diri</h3>
            <label className="field-label">Tanggal Lahir</label>
            <input type="date" name="tanggal_lahir" value={form.tanggal_lahir} onChange={handleChange} className="input-field" />
            <label className="field-label">No. HP</label>
            <input name="no_hp" value={form.no_hp} onChange={handleChange} className="input-field" />
            <label className="field-label">Alamat</label>
            <input name="alamat" value={form.alamat} onChange={handleChange} className="input-field" />

            <h3 className="font-semibold text-sm text-slate-500 mb-2 mt-4">Data Medis</h3>
            <label className="field-label">Golongan Darah</label>
            <input name="golongan_darah" value={form.golongan_darah} onChange={handleChange} className="input-field" />
            <label className="field-label">Riwayat Penyakit</label>
            <input name="riwayat_penyakit" value={form.riwayat_penyakit} onChange={handleChange} className="input-field" />
            <label className="field-label">Alergi</label>
            <input name="alergi" value={form.alergi} onChange={handleChange} className="input-field" />

            <h3 className="font-semibold text-sm text-slate-500 mb-2 mt-4">Kontak Lainnya</h3>
            <label className="field-label">Nama Pasangan</label>
            <input name="nama_pasangan" value={form.nama_pasangan} onChange={handleChange} className="input-field" />
            <label className="field-label">Kontak Darurat (nama & no. HP)</label>
            <input name="kontak_darurat" value={form.kontak_darurat} onChange={handleChange} className="input-field" />

            <button type="submit" className="btn-primary mt-2">Simpan</button>
          </form>
        </div>
      </div>
    </>
  );
}
