import express from 'express';
import { buatArtikel, lihatArtikel } from '../controllers/artikelController.js';
import { verifikasiToken, izinkanRole } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/', verifikasiToken, izinkanRole('bidan', 'superadmin'), upload.single('foto'), buatArtikel);
router.get('/', lihatArtikel);

export default router;
