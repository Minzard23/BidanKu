import pool from '../config/db.js';

export async function kirimPesan(req, res) {
  const { pesan, pasien_id } = req.body;
  if (!pesan) return res.status(400).json({ message: 'Pesan tidak boleh kosong.' });

  const { id: pengirimId, role } = req.user;
  let threadPasienId;

  if (role === 'pasien') {
    threadPasienId = pengirimId;
  } else {
    if (!pasien_id) return res.status(400).json({ message: 'pasien_id wajib diisi kalau pengirim bidan.' });
    threadPasienId = pasien_id;
  }

  const [result] = await pool.query(
    `INSERT INTO pesan_konsultasi (pasien_id, pengirim_id, pesan) VALUES (?, ?, ?)`,
    [threadPasienId, pengirimId, pesan]
  );
  res.status(201).json({ message: 'Pesan terkirim.', id: result.insertId });
}

export async function lihatPesan(req, res) {
  const { pasien_id } = req.params;
  const { id, role } = req.user;

  if (role === 'pasien' && Number(pasien_id) !== id) {
    return res.status(403).json({ message: 'Anda tidak bisa lihat chat pasien lain.' });
  }

  const [rows] = await pool.query(
    `SELECT pk.*, u.nama AS nama_pengirim, u.role AS role_pengirim
     FROM pesan_konsultasi pk JOIN users u ON pk.pengirim_id = u.id
     WHERE pk.pasien_id = ? ORDER BY pk.dikirim_pada ASC`,
    [pasien_id]
  );
  res.json(rows);
}

export async function daftarPercakapan(req, res) {
  const [rows] = await pool.query(`
    SELECT u.id AS pasien_id, u.nama,
      (SELECT pesan FROM pesan_konsultasi WHERE pasien_id = u.id ORDER BY dikirim_pada DESC LIMIT 1) AS pesan_terakhir,
      (SELECT COUNT(*) FROM pesan_konsultasi WHERE pasien_id = u.id AND dibaca = 0 AND pengirim_id != ?) AS belum_dibaca
    FROM users u
    WHERE u.role = 'pasien' AND EXISTS (SELECT 1 FROM pesan_konsultasi WHERE pasien_id = u.id)
  `, [req.user.id]);
  res.json(rows);
}