import express from 'express';
import { lihatProfil, updateProfil } from '../controllers/profilController.js';
import { verifikasiToken, izinkanRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifikasiToken, izinkanRole('pasien'), lihatProfil);
router.put('/', verifikasiToken, izinkanRole('pasien'), updateProfil);

export default router;