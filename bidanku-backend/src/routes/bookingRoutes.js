import express from 'express';
import { buatBooking, lihatBooking, ubahStatusBooking } from '../controllers/bookingController.js';
import { verifikasiToken, izinkanRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifikasiToken, izinkanRole('pasien'), buatBooking);
router.get('/', verifikasiToken, lihatBooking);
router.patch('/:id/status', verifikasiToken, izinkanRole('bidan', 'superadmin'), ubahStatusBooking);

export default router;