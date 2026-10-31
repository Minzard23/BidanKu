import pool from '../config/db.js';

export async function tambahObat(req, res) {
  const { nama, deskripsi, harga, stok } = req.body;
  if (!nama || !harga) return res.status(400).json({ message: 'Nama dan harga wajib diisi.' });
  if (Number(harga) <= 0) return res.status(400).json({ message: 'Harga harus lebih dari 0.' });

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

export async function lihatSatuObat(req, res) {
  const { id } = req.params;
  const [rows] = await pool.query(`SELECT * FROM obat WHERE id = ?`, [id]);
  if (rows.length === 0) return res.status(404).json({ message: 'Obat tidak ditemukan.' });

  const [fotoRows] = await pool.query(`SELECT path FROM obat_foto WHERE obat_id = ?`, [id]);
  const obat = rows[0];
  obat.fotos = fotoRows.map((f) => f.path);
  res.json(obat);
}

export async function updateObat(req, res) {
  const { id } = req.params;
  const { nama, deskripsi, harga, stok } = req.body;

  if (!nama || !harga) return res.status(400).json({ message: 'Nama dan harga wajib diisi.' });
  if (Number(harga) <= 0) return res.status(400).json({ message: 'Harga harus lebih dari 0.' });
  if (stok !== undefined && Number(stok) < 0) return res.status(400).json({ message: 'Stok tidak boleh negatif.' });

  const [existing] = await pool.query(`SELECT id FROM obat WHERE id = ?`, [id]);
  if (existing.length === 0) return res.status(404).json({ message: 'Obat tidak ditemukan.' });

  await pool.query(
    `UPDATE obat SET nama = ?, deskripsi = ?, harga = ?, stok = ? WHERE id = ?`,
    [nama, deskripsi || null, harga, stok || 0, id]
  );

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      await pool.query(`INSERT INTO obat_foto (obat_id, path) VALUES (?, ?)`, [id, `/uploads/${file.filename}`]);
    }
  }

  res.json({ message: 'Obat berhasil diperbarui.' });
}

export async function hapusObat(req, res) {
  const { id } = req.params;

  const [existing] = await pool.query(`SELECT id FROM obat WHERE id = ?`, [id]);
  if (existing.length === 0) return res.status(404).json({ message: 'Obat tidak ditemukan.' });

  const [dipakai] = await pool.query(`SELECT id FROM pesanan_obat_detail WHERE obat_id = ? LIMIT 1`, [id]);
  if (dipakai.length > 0) {
    return res.status(400).json({ message: 'Obat ini sudah pernah dipesan, tidak bisa dihapus. Ubah stoknya jadi 0 kalau ingin menghentikan penjualan.' });
  }

  await pool.query(`DELETE FROM obat_foto WHERE obat_id = ?`, [id]);
  await pool.query(`DELETE FROM obat WHERE id = ?`, [id]);
  res.json({ message: 'Obat berhasil dihapus.' });
}
