import pool from '../config/db.js';

export async function buatAgenda(req, res) {
    const { judul, deskripsi, tanggal, jam, lokasi } = req.body;
    if (!judul || !tanggal) return res.status(400).json({ message: 'Judul dan Tanggal wajib diisi.' });

    const foto = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await pool.query(
        `INSERT INTO agenda (bidan_id, judul, deskripsi, tanggal, jam, lokasi, foto) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [req.user.id, judul, deskripsi || null, tanggal, jam || null, lokasi || null, foto]
    );
    res.status(201).json({ message: 'Agenda berhasil dibuat.', id: result.insertId });
}

export async function lihatAgenda(req, res) {
  const [rows] = await pool.query(`SELECT * FROM agenda ORDER BY tanggal ASC`);
  res.json(rows);
}
