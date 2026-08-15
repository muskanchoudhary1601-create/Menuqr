const crypto = require('crypto');
const MenuItem = require('../models/MenuItem');
const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');
const Restaurant = require('../models/Restaurant');
const getOwnedRestaurant = require('../utils/getOwnedRestaurant');
const { PLANS, getPlan, calculatePlanPrice } = require('../config/plans');
const {
  getRazorpayInstance,
  isRazorpayConfigured,
  verifyRazorpaySignature,
  verifyWebhookSignature,
} = require('../config/razorpay');

// @desc    Get the logged-in owner's current plan, validity, limits & usage
// @route   GET /api/billing/plan
// @access  Private
const getMyPlan = async (req, res, next) => {
  try {
    const restaurant = await getOwnedRestaurant(req.user._id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const plan = getPlan(restaurant.subscriptionPlan);
    const menuItemCount = await MenuItem.countDocuments({ restaurantId: restaurant._id });

    // Check if subscription has expired
    const isExpired =
      restaurant.subscriptionValidUntil &&
      new Date() > new Date(restaurant.subscriptionValidUntil) &&
      restaurant.subscriptionPlan !== 'free';

    res.status(200).json({
      currentPlan: restaurant.subscriptionPlan,
      plan,
      subscriptionBillingCycle: restaurant.subscriptionBillingCycle || 'monthly',
      subscriptionValidUntil: restaurant.subscriptionValidUntil || null,
      subscriptionStatus: isExpired ? 'expired' : restaurant.subscriptionStatus || 'active',
      isExpired,
      usage: {
        menuItems: menuItemCount,
        maxMenuItems: plan.maxMenuItems,
      },
      plans: PLANS,
      isPaymentGatewayReady: isRazorpayConfigured(),
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a Razorpay Order for purchasing/upgrading a plan
// @route   POST /api/billing/create-order
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { plan, billingCycle = 'monthly' } = req.body;

    if (!['pro', 'business'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid plan selected for payment' });
    }

    if (!['monthly', 'annual'].includes(billingCycle)) {
      return res.status(400).json({ message: 'Invalid billing cycle' });
    }

    const restaurant = await getOwnedRestaurant(req.user._id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const amountInInr = calculatePlanPrice(plan, billingCycle);
    if (amountInInr <= 0) {
      return res.status(400).json({ message: 'Invalid plan price' });
    }

    const amountInPaise = amountInInr * 100;
    const razorpay = getRazorpayInstance();

    let orderId = '';
    if (razorpay) {
      // Create real Razorpay order
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${restaurant._id.toString().slice(-6)}_${Date.now().toString().slice(-6)}`,
        notes: {
          restaurantId: restaurant._id.toString(),
          userId: req.user._id.toString(),
          plan,
          billingCycle,
        },
      });
      orderId = order.id;
    } else {
      // Demo / Development mode order
      orderId = `order_demo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }

    // Save pending payment record in DB
    await Payment.create({
      restaurantId: restaurant._id,
      userId: req.user._id,
      plan,
      billingCycle,
      amount: amountInInr,
      currency: 'INR',
      status: 'created',
      paymentGateway: razorpay ? 'razorpay' : 'manual',
      razorpayOrderId: orderId,
    });

    res.status(200).json({
      orderId,
      amount: amountInPaise,
      amountInInr,
      currency: 'INR',
      plan,
      billingCycle,
      planLabel: getPlan(plan).label,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo_key',
      isDemoMode: !razorpay,
      restaurantName: restaurant.name,
      userEmail: req.user.email,
      userPhone: req.user.phone || '',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment signature & activate subscription
// @route   POST /api/billing/verify-payment
// @access  Private
const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, paymentId, signature, plan, billingCycle = 'monthly' } = req.body;

    if (!orderId || !plan) {
      return res.status(400).json({ message: 'Missing order details for verification' });
    }

    const restaurant = await getOwnedRestaurant(req.user._id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const isLive = isRazorpayConfigured();
    if (isLive) {
      if (!paymentId || !signature) {
        return res.status(400).json({ message: 'Payment ID and signature are required' });
      }

      const isValid = verifyRazorpaySignature({
        orderId,
        paymentId,
        signature,
      });

      if (!isValid) {
        // Record failed attempt
        await Payment.findOneAndUpdate(
          { razorpayOrderId: orderId },
          { status: 'failed', razorpayPaymentId: paymentId }
        );
        return res.status(400).json({ message: 'Payment signature verification failed' });
      }
    }

    // Calculate subscription expiration date
    const now = new Date();
    const durationDays = billingCycle === 'annual' ? 365 : 30;
    const validUntil = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

    const invoiceNumber = `INV-${now.getFullYear()}-${Date.now().toString(36).toUpperCase()}`;

    // Update restaurant plan
    restaurant.subscriptionPlan = plan;
    restaurant.subscriptionBillingCycle = billingCycle;
    restaurant.subscriptionValidUntil = validUntil;
    restaurant.subscriptionStatus = 'active';
    await restaurant.save();

    // Update Payment record
    const amountInInr = calculatePlanPrice(plan, billingCycle);
    await Payment.findOneAndUpdate(
      { razorpayOrderId: orderId },
      {
        status: 'completed',
        razorpayPaymentId: paymentId || `demo_pay_${Date.now()}`,
        razorpaySignature: signature || 'demo_signature',
        invoiceNumber,
        validUntil,
        amount: amountInInr,
      },
      { upsert: true, new: true }
    );

    // Audit log subscription change
    await Subscription.create({
      restaurantId: restaurant._id,
      plan,
      source: isLive ? 'payment_gateway' : 'self_serve',
      status: 'active',
    });

    res.status(200).json({
      success: true,
      message: `🎉 Successfully subscribed to ${getPlan(plan).label} Plan!`,
      currentPlan: plan,
      subscriptionBillingCycle: billingCycle,
      subscriptionValidUntil: validUntil,
      invoiceNumber,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment & invoice transaction history
// @route   GET /api/billing/history
// @access  Private
const getPaymentHistory = async (req, res, next) => {
  try {
    const restaurant = await getOwnedRestaurant(req.user._id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const payments = await Payment.find({
      restaurantId: restaurant._id,
      status: { $in: ['completed', 'created', 'failed'] },
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ payments });
  } catch (error) {
    next(error);
  }
};

// @desc    Self-serve downgrade to Free plan
// @route   POST /api/billing/downgrade-free
// @access  Private
const downgradeToFree = async (req, res, next) => {
  try {
    const restaurant = await getOwnedRestaurant(req.user._id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const menuItemCount = await MenuItem.countDocuments({ restaurantId: restaurant._id });
    const freeLimit = getPlan('free').maxMenuItems;
    if (menuItemCount > freeLimit) {
      return res.status(400).json({
        message: `You have ${menuItemCount} dishes, which exceeds the Free plan limit of ${freeLimit}. Please reduce dishes before downgrading.`,
      });
    }

    restaurant.subscriptionPlan = 'free';
    restaurant.subscriptionStatus = 'active';
    restaurant.subscriptionValidUntil = null;
    await restaurant.save();

    await Subscription.create({
      restaurantId: restaurant._id,
      plan: 'free',
      source: 'self_serve',
      status: 'active',
    });

    res.status(200).json({
      message: 'Downgraded to Free plan successfully',
      currentPlan: 'free',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Handle Razorpay Webhooks (order.paid, payment.captured)
// @route   POST /api/billing/webhook
// @access  Public (Webhook Signature Verified)
const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.rawBody || JSON.stringify(req.body);

    if (!verifyWebhookSignature(rawBody, signature)) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payment?.entity || payload.order?.entity;
      const orderId = paymentEntity?.order_id || paymentEntity?.id;

      if (orderId) {
        const paymentRecord = await Payment.findOne({ razorpayOrderId: orderId });
        if (paymentRecord && paymentRecord.status !== 'completed') {
          paymentRecord.status = 'completed';
          paymentRecord.razorpayPaymentId = paymentEntity.id;
          await paymentRecord.save();

          await Restaurant.findByIdAndUpdate(paymentRecord.restaurantId, {
            subscriptionPlan: paymentRecord.plan,
            subscriptionStatus: 'active',
            subscriptionValidUntil: paymentRecord.validUntil,
          });
        }
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ message: 'Webhook processing error' });
  }
};

module.exports = {
  getMyPlan,
  createOrder,
  verifyPayment,
  getPaymentHistory,
  downgradeToFree,
  handleWebhook,
};

