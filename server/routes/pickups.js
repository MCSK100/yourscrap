import express from 'express';
import { createPickup, getMyPickups } from '../controllers/pickupController.js';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyAuth, createPickup);
router.get('/my-pickups', verifyAuth, getMyPickups);

export default router;
