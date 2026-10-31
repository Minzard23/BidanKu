-- Patch: foto profil, data pasangan/darurat, catatan booking, data kehamilan tambahan, checkout obat
USE bidanku;

-- profil_pasien: nama pasangan & kontak darurat
SET @e := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='profil_pasien' AND COLUMN_NAME='nama_pasangan');
SET @s := IF(@e=0, 'ALTER TABLE profil_pasien ADD COLUMN nama_pasangan VARCHAR(150) NULL', 'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

SET @e := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='profil_pasien' AND COLUMN_NAME='kontak_darurat');
SET @s := IF(@e=0, 'ALTER TABLE profil_pasien ADD COLUMN kontak_darurat VARCHAR(100) NULL', 'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

-- booking: catatan
SET @e := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='booking' AND COLUMN_NAME='catatan');
SET @s := IF(@e=0, 'ALTER TABLE booking ADD COLUMN catatan TEXT NULL', 'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

-- data_kehamilan: tinggi & berat badan awal
SET @e := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='data_kehamilan' AND COLUMN_NAME='tinggi_badan_awal');
SET @s := IF(@e=0, 'ALTER TABLE data_kehamilan ADD COLUMN tinggi_badan_awal DECIMAL(5,2) NULL', 'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

SET @e := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='data_kehamilan' AND COLUMN_NAME='berat_badan_awal');
SET @s := IF(@e=0, 'ALTER TABLE data_kehamilan ADD COLUMN berat_badan_awal DECIMAL(5,2) NULL', 'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

-- pesanan_obat: checkout (alamat, metode bayar, bukti transfer)
SET @e := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='pesanan_obat' AND COLUMN_NAME='alamat_pengiriman');
SET @s := IF(@e=0, 'ALTER TABLE pesanan_obat ADD COLUMN alamat_pengiriman VARCHAR(255) NULL', 'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

SET @e := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='pesanan_obat' AND COLUMN_NAME='metode_pembayaran');
SET @s := IF(@e=0, 'ALTER TABLE pesanan_obat ADD COLUMN metode_pembayaran VARCHAR(50) NULL', 'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

SET @e := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='pesanan_obat' AND COLUMN_NAME='bukti_transfer');
SET @s := IF(@e=0, 'ALTER TABLE pesanan_obat ADD COLUMN bukti_transfer VARCHAR(255) NULL', 'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

SELECT 'PATCH FITUR BARU SELESAI' AS status;
