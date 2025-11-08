import express from 'express';
const router = express.Router();
import { detectCriminal } from '../controllers/detectionController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/', protect, detectCriminal);

export default router;
