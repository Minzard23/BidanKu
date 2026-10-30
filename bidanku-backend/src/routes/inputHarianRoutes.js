import express from 'express';
import { simpanInputHarian, lihatInputHarian } from '../controllers/inputHarianController.js';
import { verifikasiToken, izinkanRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifikasiToken, izinkanRole('bidan', 'superadmin'), simpanInputHarian);
router.get('/', verifikasiToken, izinkanRole('bidan', 'superadmin'), lihatInputHarian);

export default router;