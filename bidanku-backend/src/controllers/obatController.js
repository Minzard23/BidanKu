import pool from '../config/db.js';

export async function tambahObat(req, res) {
  const { nama, deskripsi, harga, stok } = req.body;
  if (!nama || !harga) return res.status(400).json({ message: 'Nama dan harga wajib diisi.' });

  const [result] = await pool.query(
    `INSERT INTO obat (nama, deskripsi, harga, stok) VALUES (?, ?, ?, ?)`,
    [nama, deskripsi || null, harga, stok || 0]
  );
  const idObat = result.insertId;

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      await pool.query(`INSERT INTO obat_foto (obat_id, path) VALUES (?, ?)`, [idObat, `/uploads/${file.filename}`]);
    }
  }

  res.status(201).json({ message: 'Obat berhasil ditambahkan.', id: idObat });
}

export async function lihatObat(req, res) {
  const [rows] = await pool.query(`SELECT * FROM obat ORDER BY nama ASC`);
  for (const o of rows) {
    const [fotoRows] = await pool.query(`SELECT path FROM obat_foto WHERE obat_id = ?`, [o.id]);
    o.fotos = fotoRows.map((f) => f.path);
  }
  res.json(rows);
}