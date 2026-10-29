import express from 'express';
import { registerPasien, login, saya } from '../controllers/authController.js';
import { verifikasiToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerPasien);
router.post('/login', login);
router.get('/saya', verifikasiToken, saya);

export default router;
