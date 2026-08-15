const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, login, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Limit login/register attempts to slow down brute-force / credential-stuffing attacks.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 20 : 1000,
  message: { message: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
