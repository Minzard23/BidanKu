import express from 'express';
import { buatPesanan, lihatPesanan, ubahStatusPesanan, uploadBuktiTransfer } from '../controllers/pesananController.js';
import { verifikasiToken, izinkanRole } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/', verifikasiToken, izinkanRole('pasien'), buatPesanan);
router.get('/', verifikasiToken, lihatPesanan);
router.patch('/:id/status', verifikasiToken, izinkanRole('bidan', 'superadmin'), ubahStatusPesanan);
router.post('/:id/bukti-transfer', verifikasiToken, izinkanRole('pasien'), upload.single('bukti'), uploadBuktiTransfer);

export default router;
