const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      maxlength: 80,
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: 300,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      default: '',
    },
    imagePublicId: {
      type: String,
      default: '',
    },
    dietType: {
      type: String,
      enum: ['veg', 'non-veg'],
      required: [true, 'Vegetarian/non-vegetarian indicator is required'],
    },
    isAvailable: {
      type: Boolean,
      default: true, // owner marks false when they've run out, without deleting the item
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0, // display order within its category
    },
  },
  { timestamps: true }
);

// Speeds up the common public-menu query: all available items in a restaurant.
menuItemSchema.index({ restaurantId: 1, categoryId: 1, order: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
