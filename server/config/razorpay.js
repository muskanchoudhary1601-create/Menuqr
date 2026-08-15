const Razorpay = require('razorpay');
const crypto = require('crypto');

let razorpayInstance = null;

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    return null;
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id,
      key_secret,
    });
  }

  return razorpayInstance;
};

const isRazorpayConfigured = () => {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
};

const verifyRazorpaySignature = ({ orderId, paymentId, signature }) => {
  const secret = process.env.RAZORPAY_KEY_SECRET || 'dev_secret';
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return expectedSignature === signature;
};

const verifyWebhookSignature = (bodyString, signature) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) return true; // if no webhook secret is set, allow dev testing

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(bodyString)
    .digest('hex');

  return expectedSignature === signature;
};

module.exports = {
  getRazorpayInstance,
  isRazorpayConfigured,
  verifyRazorpaySignature,
  verifyWebhookSignature,
};
