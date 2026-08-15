const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const MenuView = require('../models/MenuView');
const getOwnedRestaurant = require('../utils/getOwnedRestaurant');

const VALID_TYPES = ['menu_view', 'qr_scan', 'category_view', 'item_view'];

// @desc    Record a single analytics event from the public menu
//          (page load, QR scan, category tap, item tap)
// @route   POST /api/analytics/view
// @access  Public
const recordView = async (req, res, next) => {
  try {
    const { slug, type, categoryId, itemId } = req.body;

    if (!slug || !VALID_TYPES.includes(type)) {
      return res.status(400).json({ message: 'A valid slug and type are required' });
    }

    const restaurant = await Restaurant.findOne({ slug }).select('_id');
    if (!restaurant) {
      // Fail quietly — this is a background beacon call, not something the
      // customer-facing page should ever surface an error for.
      return res.status(200).json({ recorded: false });
    }

    const event = { restaurantId: restaurant._id, type };

    // Only attach category/item ids that actually belong to this
    // restaurant, so a tampered request can't pollute another
    // restaurant's data or reference ids that don't exist.
    if (categoryId) {
      const category = await Category.findOne({ _id: categoryId, restaurantId: restaurant._id }).select('_id');
      if (category) event.categoryId = category._id;
    }
    if (itemId) {
      const item = await MenuItem.findOne({ _id: itemId, restaurantId: restaurant._id }).select('_id');
      if (item) event.itemId = item._id;
    }

    await MenuView.create(event);

    res.status(201).json({ recorded: true });
  } catch (error) {
    next(error);
  }
};

// @desc    Get basic analytics for the logged-in owner's restaurant
// @route   GET /api/analytics
// @access  Private
const getAnalytics = async (req, res, next) => {
  try {
    const restaurant = await getOwnedRestaurant(req.user._id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const restaurantId = restaurant._id;

    const [menuViews, qrScans, topItem, topCategory] = await Promise.all([
      MenuView.countDocuments({ restaurantId, type: 'menu_view' }),
      MenuView.countDocuments({ restaurantId, type: 'qr_scan' }),
      MenuView.aggregate([
        { $match: { restaurantId, type: 'item_view', itemId: { $ne: null } } },
        { $group: { _id: '$itemId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ]),
      MenuView.aggregate([
        { $match: { restaurantId, type: 'category_view', categoryId: { $ne: null } } },
        { $group: { _id: '$categoryId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ]),
    ]);

    let mostViewedItem = null;
    if (topItem.length > 0) {
      const item = await MenuItem.findById(topItem[0]._id).select('name');
      if (item) mostViewedItem = { name: item.name, views: topItem[0].count };
    }

    let mostViewedCategory = null;
    if (topCategory.length > 0) {
      const category = await Category.findById(topCategory[0]._id).select('name');
      if (category) mostViewedCategory = { name: category.name, views: topCategory[0].count };
    }

    res.status(200).json({ menuViews, qrScans, mostViewedItem, mostViewedCategory });
  } catch (error) {
    next(error);
  }
};

module.exports = { recordView, getAnalytics };
