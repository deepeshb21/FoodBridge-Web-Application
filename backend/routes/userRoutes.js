
import express from 'express';
import {
  registerUser,
  loginUser,
  getAllNgos,
  getUnverifiedNgos,
  verifyNgo,
  getVerifiedNGOs,
  updateProfile,
  getNgoStats,
  getProfile,
} from '../controllers/userController.js';

import { protect } from '../middleware/authMiddleware.js';
import adminOnly from '../middleware/adminMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import User from '../models/User.js';

const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/ngos', getVerifiedNGOs);


router.get('/profile', protect, getProfile); 
router.put('/profile', protect, upload.single('image'), updateProfile); // Cloudinary upload


router.get('/all-ngos', protect, adminOnly, getAllNgos);
router.get('/ngos/unverified', protect, adminOnly, getUnverifiedNgos);
router.put('/ngos/verify/:id', protect, adminOnly, verifyNgo);
router.get('/ngo-stats', protect, adminOnly, getNgoStats);

router.put('/block-user/:id', protect, adminOnly, async (req, res) => {
  try {
    const { isBlocked } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error blocking/unblocking user:', error);
    res.status(500).json({
      message: 'Failed to update block status',
      error: error.message,
    });
  }
});

export default router;
