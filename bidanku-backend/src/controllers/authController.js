import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export async function registerPasien(req, res) {
  const { nama, email, password, no_hp } = req.body;
  if (!nama || !email || !password) {
    return res.status(400).json({ message: 'Nama, email, dan password wajib diisi.' });
  }

  const hash = await bcrypt.hash(password, 10);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO users (nama, email, password, role, no_hp) VALUES (?, ?, ?, 'pasien', ?)`,
      [nama, email, hash, no_hp || null]
    );
    const idUser = result.insertId;

    await conn.query(`INSERT INTO profil_pasien (user_id) VALUES (?)`, [idUser]);

    await conn.commit();
    return res.status(201).json({ message: 'Registrasi berhasil, silakan login.' });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi.' });
  }

  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length === 0) {
    return res.status(401).json({ message: 'Email atau password salah.' });
  }
  const user = rows[0];

  const cocok = await bcrypt.compare(password, user.password);
  if (!cocok) {
    return res.status(401).json({ message: 'Email atau password salah.' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, nama: user.nama },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({
    message: 'Login berhasil',
    token,
    user: { id: user.id, nama: user.nama, email: user.email, role: user.role },
  });
}

export async function saya(req, res) {
  const [rows] = await pool.query('SELECT id, nama, email, role FROM users WHERE id = ?', [req.user.id]);
  if (rows.length === 0) {
    return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
  }
  res.json({ user: rows[0] });
}
