import pool from '../config/db.js';

export async function buatBooking(req, res) {
    const { jenis, tanggal, jam, keluhan, catatan } = req.body;
    const pasienId = req.user.id;

    if (!jenis || !tanggal || !jam || !keluhan) {
        return res.status(400).json({ message: 'Jenis, tanggal, jam, dan keluhan wajib diisi.' });
    }

    const [result] = await pool.query(
        `INSERT INTO booking (pasien_id, jenis, tanggal, jam, keluhan, catatan) VALUES (?, ?, ?, ?, ?, ?)`,
        [pasienId, jenis, tanggal, jam, keluhan, catatan || null]
    );

    res.status(201).json({ message: 'Booking berhasil dibuat.', bookingId: result.insertId });
}

export async function lihatBooking(req, res) {
    const { id, role } = req.user;

    let query = '';
    let params = [];

    if (role === 'pasien') {
        query = 'SELECT * FROM booking WHERE pasien_id = ? ORDER BY tanggal DESC, jam DESC';
        params = [id];
    } else {
        query = `
            SELECT b.*, u.nama AS nama_pasien
            FROM booking b
            JOIN users u ON b.pasien_id = u.id
            ORDER BY b.tanggal DESC, b.jam DESC
        `;
        params = [];
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
}

export async function ubahStatusBooking(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    const statusValid = ['menunggu', 'dikonfirmasi', 'selesai', 'dibatalkan'];
    if (!statusValid.includes(status)) {
        return res.status(400).json({ message: 'Status tidak valid.' });
    }

    const [result] = await pool.query(
        'UPDATE booking SET status = ? WHERE id = ?',
        [status, id]
    );

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Booking tidak ditemukan.' });
    }

    res.json({ message: 'Status booking berhasil diubah.' });
}
