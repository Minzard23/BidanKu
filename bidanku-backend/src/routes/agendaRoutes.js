import express from 'express';
import { buatAgenda, lihatAgenda } from '../controllers/agendaController.js';
import { verifikasiToken, izinkanRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifikasiToken, izinkanRole('bidan', 'superadmin'), buatAgenda);
router.get('/', lihatAgenda);

export default router;