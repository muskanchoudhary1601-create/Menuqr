const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: 50,
    },
    order: {
      type: Number,
      default: 0, // lower = appears first; used for drag-reorder
    },
    isEnabled: {
      type: Boolean,
      default: true, // disabled categories are hidden from the public menu
    },
  },
  { timestamps: true }
);

// A restaurant shouldn't have two categories with the identical name.
categorySchema.index({ restaurantId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
