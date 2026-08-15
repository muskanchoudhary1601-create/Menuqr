const mongoose = require('mongoose');

// A history/record of plan changes for a restaurant. Restaurant.subscriptionPlan
// is the fast "what plan are they on right now" read used by limit checks;
// this collection is the append-only record of how they got there — the
// same shape a real payment gateway's webhooks (Stripe/Razorpay) would
// write into once billing is wired in.
const subscriptionSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'business'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'canceled'],
      default: 'active',
    },
    // No real payment gateway yet — this records how the plan was set so
    // it's obvious in the data which rows were real charges vs. the
    // placeholder self-serve switcher.
    source: {
      type: String,
      enum: ['self_serve', 'payment_gateway', 'admin'],
      default: 'self_serve',
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

subscriptionSchema.index({ restaurantId: 1, createdAt: -1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
