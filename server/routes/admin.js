import express from 'express';
import { getPickupList, updatePickup, deletePickup, getSettings, updateSetting, getAnalytics } from '../controllers/adminController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyAdmin);

router.get('/pickups', getPickupList);
router.patch('/pickups/:id', updatePickup);
router.delete('/pickups/:id', deletePickup);
router.get('/settings', getSettings);
router.put('/settings/:key', updateSetting);
router.get('/analytics', getAnalytics);

export default router;
