import pool from '../config/db.js';

export async function buatPesanan(req, res) {
  const { items } = req.body; // contoh: [{ obat_id: 1, jumlah: 2 }, { obat_id: 3, jumlah: 1 }]
  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Pesanan harus ada minimal 1 item.' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let totalHarga = 0;
    const detailSiap = [];

    for (const item of items) {
      const [obatRows] = await conn.query(`SELECT * FROM obat WHERE id = ?`, [item.obat_id]);
      if (obatRows.length === 0) throw new Error(`Obat id ${item.obat_id} tidak ditemukan.`);
      const obat = obatRows[0];

      const subtotal = obat.harga * item.jumlah;
      totalHarga += subtotal;
      detailSiap.push({ obat_id: obat.id, jumlah: item.jumlah, harga_satuan: obat.harga, subtotal });
    }

    const [pesananResult] = await conn.query(
      `INSERT INTO pesanan_obat (pasien_id, total_harga) VALUES (?, ?)`,
      [req.user.id, totalHarga]
    );
    const idPesanan = pesananResult.insertId;

    for (const d of detailSiap) {
      await conn.query(
        `INSERT INTO pesanan_obat_detail (pesanan_id, obat_id, jumlah, harga_satuan, subtotal) VALUES (?, ?, ?, ?, ?)`,
        [idPesanan, d.obat_id, d.jumlah, d.harga_satuan, d.subtotal]
      );
    }

    await conn.commit();
    res.status(201).json({ message: 'Pesanan berhasil dibuat.', id_pesanan: idPesanan, total_harga: totalHarga });
  } catch (err) {
    await conn.rollback();
    res.status(400).json({ message: err.message || 'Gagal membuat pesanan.' });
  } finally {
    conn.release();
  }
}

export async function lihatPesanan(req, res) {
  const { id, role } = req.user;
  let query, params;
  if (role === 'pasien') {
    query = `SELECT * FROM pesanan_obat WHERE pasien_id = ? ORDER BY dibuat_pada DESC`;
    params = [id];
  } else {
    query = `SELECT p.*, u.nama AS nama_pasien FROM pesanan_obat p JOIN users u ON p.pasien_id = u.id ORDER BY p.dibuat_pada DESC`;
    params = [];
  }
  const [rows] = await pool.query(query, params);
  res.json(rows);
}

export async function ubahStatusPesanan(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  const statusValid = ['menunggu_konfirmasi', 'lunas', 'dikirim', 'selesai', 'dibatalkan'];
  if (!statusValid.includes(status)) {
    return res.status(400).json({ message: 'Status tidak valid.' });
  }
  await pool.query(`UPDATE pesanan_obat SET status = ? WHERE id = ?`, [status, id]);
  res.json({ message: 'Status pesanan berhasil diubah.' });
}