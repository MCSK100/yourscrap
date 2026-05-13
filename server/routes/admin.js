import express from 'express';
import { getAnalytics, getPickupList, updatePickupStatus } from '../controllers/adminController.js';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/analytics', verifyAuth, getAnalytics);
router.get('/pickups', verifyAuth, getPickupList);
router.patch('/pickups/:id', verifyAuth, updatePickupStatus);

export default router;
