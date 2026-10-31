-- ============================================================
-- SKEMA DATABASE LENGKAP: BidanKu (per 31 Okt 2026)
-- ============================================================
-- Role: pasien (daftar sendiri), bidan & superadmin (dibuatkan akun)

CREATE DATABASE IF NOT EXISTS bidanku;
USE bidanku;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NULL,
    google_id VARCHAR(100) NULL UNIQUE,
    role ENUM('pasien', 'bidan', 'superadmin') NOT NULL DEFAULT 'pasien',
    no_hp VARCHAR(20) NULL,
    foto_profil VARCHAR(255) NULL,
    aktif TINYINT(1) NOT NULL DEFAULT 1,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profil_pasien (
    user_id INT PRIMARY KEY,
    tanggal_lahir DATE NULL,
    alamat VARCHAR(255) NULL,
    golongan_darah VARCHAR(5) NULL,
    alergi TEXT NULL,
    riwayat_penyakit TEXT NULL,
    nama_pasangan VARCHAR(150) NULL,
    kontak_darurat VARCHAR(100) NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS data_kehamilan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    kehamilan_ke INT NOT NULL DEFAULT 1,
    hpht DATE NOT NULL,
    hpl DATE NOT NULL,
    status ENUM('hamil', 'melahirkan', 'keguguran') NOT NULL DEFAULT 'hamil',
    tinggi_badan_awal DECIMAL(5,2) NULL,
    berat_badan_awal DECIMAL(5,2) NULL,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS pemeriksaan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_kehamilan_id INT NOT NULL,
    dicatat_oleh INT NOT NULL,
    tanggal DATE NOT NULL,
    usia_kehamilan_minggu INT NULL,
    berat_badan DECIMAL(5,2) NULL,
    tekanan_darah VARCHAR(20) NULL,
    tinggi_fundus DECIMAL(5,2) NULL,
    status_gizi ENUM('kurang', 'normal', 'lebih') NULL,
    keluhan TEXT NULL,
    catatan_bidan TEXT NULL,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (data_kehamilan_id) REFERENCES data_kehamilan(id),
    FOREIGN KEY (dicatat_oleh) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS booking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pasien_id INT NOT NULL,
    jenis ENUM('kunjungan', 'konsultasi_online') NOT NULL,
    tanggal DATE NOT NULL,
    jam TIME NOT NULL,
    status ENUM('menunggu', 'dikonfirmasi', 'selesai', 'dibatalkan') NOT NULL DEFAULT 'menunggu',
    keluhan TEXT NOT NULL,
    catatan TEXT NULL,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pasien_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS pesan_konsultasi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pasien_id INT NOT NULL,
    pengirim_id INT NOT NULL,
    pesan TEXT NOT NULL,
    dibaca TINYINT(1) NOT NULL DEFAULT 0,
    dikirim_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pasien_id) REFERENCES users(id),
    FOREIGN KEY (pengirim_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS obat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(150) NOT NULL,
    deskripsi TEXT NULL,
    harga INT NOT NULL,
    stok INT NOT NULL DEFAULT 0,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS obat_foto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    obat_id INT NOT NULL,
    path VARCHAR(255) NOT NULL,
    FOREIGN KEY (obat_id) REFERENCES obat(id)
);

CREATE TABLE IF NOT EXISTS pesanan_obat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pasien_id INT NOT NULL,
    status ENUM('menunggu_konfirmasi', 'lunas', 'dikirim', 'selesai', 'dibatalkan') NOT NULL DEFAULT 'menunggu_konfirmasi',
    total_harga INT NOT NULL DEFAULT 0,
    catatan TEXT NULL,
    alamat_pengiriman VARCHAR(255) NULL,
    metode_pembayaran VARCHAR(50) NULL,
    bukti_transfer VARCHAR(255) NULL,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pasien_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS pesanan_obat_detail (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pesanan_id INT NOT NULL,
    obat_id INT NOT NULL,
    jumlah INT NOT NULL,
    harga_satuan INT NOT NULL,
    subtotal INT NOT NULL,
    FOREIGN KEY (pesanan_id) REFERENCES pesanan_obat(id),
    FOREIGN KEY (obat_id) REFERENCES obat(id)
);

CREATE TABLE IF NOT EXISTS artikel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bidan_id INT NOT NULL,
    judul VARCHAR(200) NOT NULL,
    konten TEXT NOT NULL,
    gambar VARCHAR(255) NULL,
    status ENUM('draft', 'dipublikasi') NOT NULL DEFAULT 'dipublikasi',
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bidan_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS agenda (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bidan_id INT NOT NULL,
    judul VARCHAR(200) NOT NULL,
    deskripsi TEXT NULL,
    tanggal DATE NOT NULL,
    jam TIME NULL,
    lokasi VARCHAR(200) NULL,
    foto VARCHAR(255) NULL,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bidan_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS input_harian (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bidan_id INT NOT NULL,
    tanggal DATE NOT NULL,
    jumlah_pasien INT NOT NULL DEFAULT 0,
    pendapatan INT NOT NULL DEFAULT 0,
    catatan TEXT NULL,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unik_bidan_tanggal (bidan_id, tanggal),
    FOREIGN KEY (bidan_id) REFERENCES users(id)
);
