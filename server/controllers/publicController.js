const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');

// @desc    Get the public digital menu for a restaurant by its slug
//          (no auth — this is what customers see after scanning the QR code)
// @route   GET /api/public/menu/:slug
// @access  Public
const getPublicMenu = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ slug: req.params.slug }).select(
      'name slug logo coverImage description address phone whatsapp instagramUrl googleMapsUrl openingHours theme primaryColor backgroundStyle font cardStyle subscriptionPlan'
    );

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Only enabled categories, in display order.
    const categories = await Category.find({
      restaurantId: restaurant._id,
      isEnabled: true,
    }).sort({ order: 1 });

    const categoryIds = categories.map((c) => c._id);

    // All items belonging to those categories. We include unavailable items
    // too (so the frontend can show "Currently unavailable" rather than the
    // item just vanishing, per the product spec) — the frontend decides how
    // to render each state.
    const items = await MenuItem.find({
      restaurantId: restaurant._id,
      categoryId: { $in: categoryIds },
    }).sort({ order: 1, createdAt: 1 });

    // Group items under their category for a menu-shaped response.
    const menu = categories.map((category) => ({
      _id: category._id,
      name: category.name,
      items: items.filter((item) => String(item.categoryId) === String(category._id)),
    }));

    res.status(200).json({ restaurant, menu });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPublicMenu };
