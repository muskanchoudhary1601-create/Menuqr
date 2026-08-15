const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getMyPlan,
  createOrder,
  verifyPayment,
  getPaymentHistory,
  downgradeToFree,
  handleWebhook,
} = require('../controllers/billingController');

const router = express.Router();

// Webhook endpoint (unauthenticated, HMAC signature verified internally)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes for restaurant owners
router.get('/plan', protect, getMyPlan);
router.post('/create-order', protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);
router.get('/history', protect, getPaymentHistory);
router.post('/downgrade-free', protect, downgradeToFree);

module.exports = router;

