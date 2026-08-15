const mongoose = require('mongoose');

// A single lightweight analytics event. Kept intentionally generic (one
// collection, one `type` field) rather than separate collections per metric
// — this is "basic page-view tracking" per the product spec, not a full
// analytics pipeline.
const menuViewSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['menu_view', 'qr_scan', 'category_view', 'item_view'],
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      default: null,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Speeds up both the simple counts and the "most viewed" aggregations.
menuViewSchema.index({ restaurantId: 1, type: 1 });
menuViewSchema.index({ restaurantId: 1, type: 1, itemId: 1 });
menuViewSchema.index({ restaurantId: 1, type: 1, categoryId: 1 });

module.exports = mongoose.model('MenuView', menuViewSchema);
