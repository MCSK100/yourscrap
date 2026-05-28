import express from 'express';
import pickupsRoutes from './pickups.js';
import adminRoutes from './admin.js';

const router = express.Router();

router.use('/pickups', pickupsRoutes);
router.use('/admin', adminRoutes);

export default router;
