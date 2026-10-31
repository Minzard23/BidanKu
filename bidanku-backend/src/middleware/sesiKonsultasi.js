import pool from '../config/db.js';
export async function sesiAktif(req,res,next){
  const target=Number(req.params.pasien_id ?? (req.user.role==='pasien'?req.user.id:req.body.pasien_id));
  if(!Number.isSafeInteger(target)||target<=0||(req.user.role==='pasien'&&target!==Number(req.user.id)))return res.status(403).json({message:'Pasien tidak sesuai.'});
  const [rows]=await pool.query(`SELECT id, DATE_FORMAT(DATE_SUB(TIMESTAMP(tanggal,jam),INTERVAL 6 HOUR),'%Y-%m-%dT%H:%i:%sZ') AS berakhir
    FROM booking WHERE pasien_id=? AND jenis='konsultasi_online' AND status='dikonfirmasi' AND biaya_diterima=25000 AND diverifikasi_oleh IS NOT NULL
    AND DATE_ADD(UTC_TIMESTAMP(),INTERVAL 7 HOUR)>=TIMESTAMP(tanggal,jam)
    AND DATE_ADD(UTC_TIMESTAMP(),INTERVAL 7 HOUR)<DATE_ADD(TIMESTAMP(tanggal,jam),INTERVAL 1 HOUR)
    ORDER BY tanggal,jam LIMIT 1`,[target]);
  if(!rows.length)return res.status(403).json({message:'Chat terbuka pada jadwal konsultasi setelah pembayaran Rp25.000 diverifikasi, selama 60 menit.'});
  req.sesi=rows[0];next();
}
