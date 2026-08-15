const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'business'],
      required: true,
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'annual'],
      default: 'monthly',
    },
    amount: {
      type: Number,
      required: true, // in INR
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['created', 'completed', 'failed', 'refunded'],
      default: 'created',
      index: true,
    },
    paymentGateway: {
      type: String,
      enum: ['razorpay', 'stripe', 'manual'],
      default: 'razorpay',
    },
    razorpayOrderId: {
      type: String,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    invoiceNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    validUntil: {
      type: Date,
    },
  },
  { timestamps: true }
);

paymentSchema.index({ restaurantId: 1, createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
