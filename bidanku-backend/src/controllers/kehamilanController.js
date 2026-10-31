import pool from '../config/db.js';

export async function buatDataKehamilan(req, res) {
    const { hpht, kehamilan_ke, tinggi_badan_awal, berat_badan_awal } = req.body;
    if (!hpht) return res.status(400).json({ message: 'Tanggal HPHT harus diisi.' });

    const tanggalHPHT = new Date(hpht);
    const tanggalHpl = new Date(tanggalHPHT);
    tanggalHpl.setDate(tanggalHpl.getDate() + 280);
    const hpl = tanggalHpl.toISOString().split('T')[0];

    const [result] = await pool.query(
        `INSERT INTO data_kehamilan (user_id, kehamilan_ke, hpht, hpl, tinggi_badan_awal, berat_badan_awal) VALUES (?, ?, ?, ?, ?, ?)`,
        [req.user.id, kehamilan_ke || 1, hpht, hpl, tinggi_badan_awal || null, berat_badan_awal || null]
    );
    res.status(201).json({ message: 'Data kehamilan berhasil dibuat.', id: result.insertId, hpl });
}

export async function lihatDataKehamilan(req, res) {
    const { id, role } = req.user;
    let query, params;
    if (role === 'pasien') {
        query = `SELECT * FROM data_kehamilan WHERE user_id = ? ORDER BY id DESC`;
        params = [id];
    } else {
        query = `SELECT k.*, u.nama AS nama_pasien FROM data_kehamilan k JOIN users u ON k.user_id = u.id ORDER BY k.dibuat_pada DESC`;
        params = [];
    }
    const [rows] = await pool.query(query, params);
    res.json(rows);
}

export async function tambahPemeriksaan(req, res) {
  const { id } = req.params;
  const { tanggal, usia_kehamilan_minggu, berat_badan, tekanan_darah, tinggi_fundus, status_gizi, keluhan, catatan_bidan } = req.body;
  if (!tanggal) return res.status(400).json({ message: 'Tanggal wajib diisi.' });

  const [result] = await pool.query(
    `INSERT INTO pemeriksaan (data_kehamilan_id, dicatat_oleh, tanggal, usia_kehamilan_minggu, berat_badan, tekanan_darah, tinggi_fundus, status_gizi, keluhan, catatan_bidan)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, req.user.id, tanggal, usia_kehamilan_minggu || null, berat_badan || null, tekanan_darah || null, tinggi_fundus || null, status_gizi || null, keluhan || null, catatan_bidan || null]
  );
  res.status(201).json({ message: 'Pemeriksaan berhasil dicatat.', id: result.insertId });
}

export async function lihatPemeriksaan(req, res) {
  const { id } = req.params;
  const [rows] = await pool.query(
    `SELECT * FROM pemeriksaan WHERE data_kehamilan_id = ? ORDER BY tanggal ASC`,
    [id]
  );
  res.json(rows);
}
