import express from 'express';
const router = express.Router();
import {
  registerCriminal,
  getCriminals,
  getCriminalById,
  getFaceDescriptors, // Import the new controller
  deleteCriminal, // Import the delete controller
} from '../controllers/criminalController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, registerCriminal).get(protect, getCriminals);

router.route('/descriptors').get(protect, getFaceDescriptors);

router
  .route('/:id')
  .get(protect, getCriminalById)
  .delete(protect, deleteCriminal);

export default router;