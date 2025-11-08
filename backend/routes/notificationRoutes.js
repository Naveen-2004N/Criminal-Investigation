import express from 'express';
const router = express.Router();
import {
  registerDevice,
  sendDetectionNotification,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js'; // Import your auth middleware

// protect middleware ensures only logged-in users can access these routes
router.route('/register-device').post(protect, registerDevice);
router.route('/detection').post(protect, sendDetectionNotification);

export default router;