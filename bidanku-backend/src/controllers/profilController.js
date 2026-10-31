import pool from '../config/db.js';

export async function lihatProfil(req, res) {
    const [rows] = await pool.query(
        `SELECT u.id, u.nama, u.email, u.no_hp, u.foto_profil,
                p.tanggal_lahir, p.alamat, p.golongan_darah, p.riwayat_penyakit, p.alergi,
                p.nama_pasangan, p.kontak_darurat
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
    const { tanggal_lahir, alamat, golongan_darah, riwayat_penyakit, alergi, no_hp, nama_pasangan, kontak_darurat } = req.body;

    await pool.query(
        `UPDATE profil_pasien SET tanggal_lahir=?, alamat=?, golongan_darah=?, riwayat_penyakit=?, alergi=?, nama_pasangan=?, kontak_darurat=? WHERE user_id=?`,
        [tanggal_lahir || null, alamat || null, golongan_darah || null, riwayat_penyakit || null, alergi || null, nama_pasangan || null, kontak_darurat || null, req.user.id]
    );
    if (no_hp) {
        await pool.query(`UPDATE users SET no_hp=? WHERE id=?`, [no_hp, req.user.id]);
    }
    if (req.file) {
        await pool.query(`UPDATE users SET foto_profil=? WHERE id=?`, [`/uploads/${req.file.filename}`, req.user.id]);
    }
    res.json({ message: 'Profil berhasil diperbarui.' });
}
