import express from 'express';
import { createPickup } from '../controllers/pickupController.js';

const router = express.Router();

router.post('/', createPickup);

export default router;
