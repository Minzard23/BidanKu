import express from 'express';
import { buatArtikel, lihatArtikel } from '../controllers/artikelController.js';
import { verifikasiToken, izinkanRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifikasiToken, izinkanRole('bidan', 'superadmin'), buatArtikel);
router.get('/', lihatArtikel);

export default router;