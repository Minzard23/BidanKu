import express from 'express';
import { buatPesanan, lihatPesanan, ubahStatusPesanan } from '../controllers/pesananController.js';
import { verifikasiToken, izinkanRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifikasiToken, izinkanRole('pasien'), buatPesanan);
router.get('/', verifikasiToken, lihatPesanan);
router.patch('/:id/status', verifikasiToken, izinkanRole('bidan', 'superadmin'), ubahStatusPesanan);

export default router;