import pool from '../config/db.js';

export async function tambahObat(req, res) {
  const { nama, deskripsi, harga, stok } = req.body;
  if (!nama || !harga) return res.status(400).json({ message: 'Nama dan harga wajib diisi.' });

  const foto = req.file ? `/uploads/${req.file.filename}` : null;

  const [result] = await pool.query(
    `INSERT INTO obat (nama, deskripsi, harga, stok, foto) VALUES (?, ?, ?, ?, ?)`,
    [nama, deskripsi || null, harga, stok || 0, foto]
  );
  res.status(201).json({ message: 'Obat berhasil ditambahkan.', id: result.insertId });
}

export async function lihatObat(req, res) {
  const [rows] = await pool.query(`SELECT * FROM obat ORDER BY nama ASC`);
  res.json(rows);
}