import express from 'express';
import { buatDataKehamilan, lihatDataKehamilan, tambahPemeriksaan, lihatPemeriksaan } from '../controllers/kehamilanController.js';
import { verifikasiToken, izinkanRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifikasiToken, izinkanRole('pasien'), buatDataKehamilan);
router.get('/', verifikasiToken, lihatDataKehamilan);
router.post('/:id/pemeriksaan', verifikasiToken, izinkanRole('bidan', 'superadmin'), tambahPemeriksaan);
router.get('/:id/pemeriksaan', verifikasiToken, lihatPemeriksaan);

export default router;