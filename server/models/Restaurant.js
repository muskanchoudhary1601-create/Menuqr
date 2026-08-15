const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    logo: {
      type: String,
      default: '',
    },
    logoPublicId: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    coverImagePublicId: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    whatsapp: {
      type: String,
      default: '',
    },
    instagramUrl: {
      type: String,
      default: '',
    },
    googleMapsUrl: {
      type: String,
      default: '',
    },
    openingHours: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      enum: ['classic', 'modern', 'elegant'],
      default: 'classic',
    },
    // Fine-tune controls under the chosen theme preset (Phase 7).
    // The preset above just records which card the owner last picked in
    // the UI; these fields are what the public menu actually renders with.
    primaryColor: {
      type: String,
      default: '#f97316',
      match: [/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'primaryColor must be a valid hex color'],
    },
    backgroundStyle: {
      type: String,
      enum: ['white', 'soft', 'dark'],
      default: 'white',
    },
    font: {
      type: String,
      enum: ['sans', 'serif', 'rounded'],
      default: 'sans',
    },
    cardStyle: {
      type: String,
      enum: ['rounded', 'minimal', 'bordered'],
      default: 'rounded',
    },
    subscriptionPlan: {
      type: String,
      enum: ['free', 'pro', 'business'],
      default: 'free',
    },
    subscriptionBillingCycle: {
      type: String,
      enum: ['monthly', 'annual'],
      default: 'monthly',
    },
    subscriptionValidUntil: {
      type: Date,
    },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'expired', 'canceled'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
