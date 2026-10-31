USE bidanku;
ALTER TABLE profil_pasien ADD COLUMN nama_kontak_darurat VARCHAR(150), ADD COLUMN kontak_darurat VARCHAR(30);
ALTER TABLE booking ADD COLUMN catatan TEXT;
ALTER TABLE data_kehamilan ADD COLUMN jumlah_persalinan INT, ADD COLUMN jumlah_keguguran INT, ADD COLUMN riwayat TEXT;
ALTER TABLE pesanan_obat ADD COLUMN metode_bayar VARCHAR(20) NOT NULL DEFAULT 'klinik', ADD COLUMN referensi_bayar VARCHAR(100), ADD COLUMN instruksi_transfer TEXT, ADD COLUMN checkout_key VARCHAR(64), ADD UNIQUE KEY checkout_unik (pasien_id,checkout_key);
