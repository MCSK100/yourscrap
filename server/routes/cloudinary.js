import express from 'express';
import { getCloudinarySignature } from '../controllers/cloudinaryController.js';

const router = express.Router();

router.get('/', getCloudinarySignature);

export default router;
