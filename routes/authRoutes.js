import express from 'express';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { protect } from '../middleware/authMiddleware.js'; // ✅ Correct import

const router = express.Router();

// GET /api/auth/profile (Protected)
router.get('/profile', protect, async (req, res) => {  // ✅ Use protect here
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/something', protect, (req, res) => {
  res.json({ message: 'This route is protected!' });
});

export default router;
