import pool from '../config/db.js';

export async function lihatProfil(req, res) {
    const [rows] = await pool.query(
        `SELECT i.id, u.nama, u.email, u.no_hp, p.tanggal_lahir, p.alamat, p.golongan_darah, p.riwayat_penyakit, p.riwayat_alergi
        FROM users u JOIN profil_pasien p ON u.id = p.user_id
        WHERE u.id = ?`,
        [req.user.id]
    );
    if (rows.length === 0) {
        return res.status(404).json({ message: 'Profil tidak ditemukan.' });
    }
    res.json({ profil: rows[0] });
}

export async function updateProfil(req, res) {
    const { tanggal_lahir, alamat, golongan_darah, riwayat_penyakit, riwayat_alergi, no_hp } = req.body;

    await pool.query(
        `UPDATE profil_pasien SET tanggal_lahir=?, alamat=?, golongan_darah=?, riwayat_penyakit=?, riwayat_alergi=?, no_hp=? WHERE user_id=?`,
        [tanggal_lahir || null, alamat || null, golongan_darah || null, riwayat_penyakit || null, riwayat_alergi || null, no_hp || null, req.user.id]
    );
    res.json({ message: 'Profil berhasil diperbarui.' });
}