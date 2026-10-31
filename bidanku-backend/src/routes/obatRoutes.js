import express from 'express';
import { tambahObat, lihatObat, lihatSatuObat, updateObat, hapusObat } from '../controllers/obatController.js';
import { verifikasiToken, izinkanRole } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/', verifikasiToken, izinkanRole('bidan', 'superadmin'), upload.array('foto', 3), tambahObat);
router.get('/', verifikasiToken, lihatObat);
router.get('/:id', verifikasiToken, lihatSatuObat);
router.put('/:id', verifikasiToken, izinkanRole('bidan', 'superadmin'), upload.array('foto', 3), updateObat);
router.delete('/:id', verifikasiToken, izinkanRole('bidan', 'superadmin'), hapusObat);

export default router;
