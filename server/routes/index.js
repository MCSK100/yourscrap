import express from 'express';
import cloudinaryRoutes from './cloudinary.js';
import pickupsRoutes from './pickups.js';
import adminRoutes from './admin.js';
import { verifyAuth } from '../middleware/auth.js';
import { getMyPickups } from '../controllers/pickupController.js';

const router = express.Router();

router.use('/cloudinary-sign', cloudinaryRoutes);
router.use('/pickups', pickupsRoutes);
router.use('/admin', adminRoutes);
router.get('/my-pickups', verifyAuth, getMyPickups);

export default router;
