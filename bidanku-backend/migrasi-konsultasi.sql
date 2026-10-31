ALTER TABLE booking
 ADD COLUMN dibuat_oleh INT NULL,
 ADD COLUMN tujuan_kontrol VARCHAR(60) NULL,
 ADD COLUMN referensi_konsultasi VARCHAR(100) NULL,
 ADD COLUMN biaya_diterima INT NOT NULL DEFAULT 0,
 ADD COLUMN diverifikasi_oleh INT NULL;
