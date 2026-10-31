import express from 'express';
import { tambahObat, lihatObat } from '../controllers/obatController.js';
import { verifikasiToken, izinkanRole } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/', verifikasiToken, izinkanRole('bidan', 'superadmin'), upload.array('foto', 3), tambahObat);
router.get('/', verifikasiToken, lihatObat);

export default router;