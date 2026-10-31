# BidanKu — Sistem Manajemen Praktik Bidan

Final Project — Dibimbing FWD Batch 12 Fullstack Web Development Bootcamp

Aplikasi manajemen praktik bidan yang menghubungkan pasien dengan bidan untuk booking kunjungan,
konsultasi online, pemantauan kehamilan, pemesanan obat, dan informasi edukasi kesehatan.

## Fitur Utama

**Pasien** dapat:
- Mendaftar & login
- Booking kunjungan/konsultasi online
- Mencatat data kehamilan (HPL dihitung otomatis dari HPHT)
- Melihat riwayat pemeriksaan & grafik berat badan
- Konsultasi chat langsung dengan bidan
- Memesan obat (dengan alur checkout: alamat, metode bayar, upload bukti transfer)
- Membaca artikel edukasi kehamilan

**Bidan** dapat:
- Mengelola & konfirmasi booking pasien
- Mencatat hasil pemeriksaan pasien
- Membalas konsultasi dari semua pasien
- Mengelola katalog obat (CRUD penuh: tambah, lihat, ubah, hapus)
- Mengonfirmasi status pesanan obat
- Menulis artikel edukasi
- Mencatat rekap pasien & pendapatan harian
- Melihat dashboard ringkasan (grafik tren, jadwal hari ini, stok menipis)

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React (Vite), React Router, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Autentikasi | JWT (JSON Web Token), bcrypt |
| Upload File | Multer |

## Struktur Proyek

```
BidanKu/
├── bidanku-backend/          # REST API (Express + MySQL)
│   ├── src/
│   │   ├── config/           # Koneksi database
│   │   ├── middleware/       # Auth (JWT) & upload file
│   │   ├── controllers/      # Logic bisnis tiap fitur
│   │   └── routes/           # Pemetaan URL ke controller
│   ├── schema.sql            # Skema database lengkap
│   └── server.js             # Entry point
│
├── bidanku-frontend/         # Single Page App (React + Vite)
│   └── src/
│       ├── api/               # Konfigurasi axios
│       ├── context/           # Auth state global
│       ├── components/        # Komponen reusable (Navbar, Avatar, dll)
│       └── pages/              # Halaman aplikasi
│
├── BidanKu-Dokumentasi.pdf   # Penjelasan lengkap tiap file & fungsi
└── BidanKu.postman_collection.json   # Dokumentasi API (import ke Postman)
```

## Role & Autentikasi

Aplikasi memakai **role-based access control** dengan 3 role:

| Role | Cara Dibuat | Akses |
|---|---|---|
| `pasien` | Daftar sendiri (halaman Register) | Fitur-fitur pasien |
| `bidan` | Dibuat manual oleh superadmin | Kelola semua data pasien, obat, artikel |
| `superadmin` | Dibuat manual langsung di database | Akses penuh |

Autentikasi memakai **JWT** — setelah login, token disimpan di `localStorage` dan otomatis
disertakan di setiap request lewat axios interceptor. Backend memvalidasi token & role lewat
middleware (`verifikasiToken`, `izinkanRole`) sebelum mengizinkan akses ke tiap endpoint.

## Instalasi & Menjalankan Lokal

### Backend
```bash
cd bidanku-backend
npm install
cp .env.example .env   # isi sesuai konfigurasi database lokal
npm run dev
```
Import `schema.sql` ke MySQL (lewat phpMyAdmin atau client lain) sebelum menjalankan.

### Frontend
```bash
cd bidanku-frontend
npm install
cp .env.example .env   # isi VITE_API_URL sesuai alamat backend
npm run dev
```

## Dokumentasi API

Koleksi lengkap endpoint API (request, body, auth) tersedia di
`BidanKu.postman_collection.json` — import ke Postman untuk mencoba langsung.

## ERD (Entity Relationship Diagram)

Database terdiri dari 13 tabel utama: `users`, `profil_pasien`, `data_kehamilan`,
`pemeriksaan`, `booking`, `pesan_konsultasi`, `obat`, `obat_foto`, `pesanan_obat`,
`pesanan_obat_detail`, `artikel`, `agenda`, `input_harian`. Detail relasi antar tabel ada di
`bidanku-backend/schema.sql` dan dijelaskan di `BidanKu-Dokumentasi.pdf`.

## Dikembangkan Oleh

Raza Candra Anwar — Final Project FWD Batch 12, Dibimbing.id
