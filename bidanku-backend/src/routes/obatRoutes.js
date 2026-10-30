import express from 'express';
import { tambahObat, lihatObat } from '../controllers/obatController.js';
import { verifikasiToken, izinkanRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifikasiToken, izinkanRole('bidan', 'superadmin'), tambahObat);
router.get('/', verifikasiToken, lihatObat);

export default router;