-- Tambahin kolom foto ke tabel agenda (buat dokumentasi kegiatan)
USE bidanku;

SET @e := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='agenda' AND COLUMN_NAME='foto');
SET @s := IF(@e=0, 'ALTER TABLE agenda ADD COLUMN foto VARCHAR(255) NULL', 'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

SELECT 'PATCH SELESAI' AS status;
