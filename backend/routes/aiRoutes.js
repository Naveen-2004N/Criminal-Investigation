import express from 'express';
const router = express.Router();
import { generateSketch } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/generate-sketch').post(protect, generateSketch);

export default router;