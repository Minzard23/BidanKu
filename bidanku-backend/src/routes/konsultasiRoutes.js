import express from 'express';
import { kirimPesan, lihatPesan, daftarPercakapan } from '../controllers/konsultasiController.js';
import { verifikasiToken, izinkanRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifikasiToken, kirimPesan);
router.get('/:pasien_id', verifikasiToken, lihatPesan);
router.get('/', verifikasiToken, izinkanRole('bidan', 'superadmin'), daftarPercakapan);

export default router;