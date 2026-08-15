const express = require('express');
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/authMiddleware');
const { recordView, getAnalytics } = require('../controllers/analyticsController');

const router = express.Router();

// The view-recording endpoint is public (fired from the customer-facing
// menu) and has no auth, so it gets its own rate limit against abuse.
const viewLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/view', viewLimiter, recordView); // public — called from the public menu
router.get('/', protect, getAnalytics); // private — the owner's dashboard

module.exports = router;
