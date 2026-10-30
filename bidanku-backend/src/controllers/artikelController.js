import pool from '../config/db.js';

export async function buatArtikel(req, res) {
  const { judul, konten, gambar } = req.body;
  if (!judul || !konten) return res.status(400).json({ message: 'Judul dan konten wajib diisi.' });

  const [result] = await pool.query(
    `INSERT INTO artikel (bidan_id, judul, konten, gambar) VALUES (?, ?, ?, ?)`,
    [req.user.id, judul, konten, gambar || null]
  );
  res.status(201).json({ message: 'Artikel berhasil dibuat.', id: result.insertId });
}

export async function lihatArtikel(req, res) {
  const [rows] = await pool.query(
    `SELECT a.*, u.nama AS nama_bidan FROM artikel a JOIN users u ON a.bidan_id = u.id
     WHERE a.status = 'dipublikasi' ORDER BY a.dibuat_pada DESC`
  );
  res.json(rows);
}