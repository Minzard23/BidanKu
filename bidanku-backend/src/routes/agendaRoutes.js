import express from 'express';
import { buatAgenda, lihatAgenda } from '../controllers/agendaController.js';
import { verifikasiToken, izinkanRole } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/', verifikasiToken, izinkanRole('bidan', 'superadmin'), upload.single('foto'), buatAgenda);
router.get('/', lihatAgenda);

export default router;
