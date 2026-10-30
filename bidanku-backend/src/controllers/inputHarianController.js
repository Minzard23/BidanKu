import pool from '../config/db.js';

export async function simpanInputHarian(req, res) {
    const { tanggal, jumlah_pasien, pendapatan, catatan } = req.body;
    if (!tanggal) return res.status(400).json({ message: "Tanggal wajib diisi" });

    await pool.query(
        `INSERT INTO input_harian (bidan_id, tanggal, jumlah_pasien, pendapatan, catatan) VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE jumlah_pasien = VALUES(jumlah_pasien), pendapatan = VALUES(pendapatan), catatan = VALUES(catatan)`,
        [req.user.id, tanggal, jumlah_pasien || 0, pendapatan || 0, catatan || null]
    );
    res.json({ message: "Data harian berhasil disimpan" });
}

export async function lihatInputHarian(req, res) {
    const [rowa] = await pool.query(
        `SELECT * FROM input_harian WHERE bidan_id = ? ORDER BY tanggal DESC`,
        [req.user.id]
    );
    res.json(rowa);
}   