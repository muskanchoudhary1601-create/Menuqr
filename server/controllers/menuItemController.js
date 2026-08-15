const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const getOwnedRestaurant = require('../utils/getOwnedRestaurant');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../utils/uploadToCloudinary');
const { getPlan } = require('../config/plans');

// Confirms a categoryId actually belongs to this restaurant before letting
// an item be created/moved into it. Prevents cross-restaurant category ids
// being attached to another owner's item.
const assertCategoryBelongsToRestaurant = async (categoryId, restaurantId) => {
  const category = await Category.findOne({ _id: categoryId, restaurantId });
  return Boolean(category);
};

// @desc    List menu items for the logged-in owner's restaurant
//          Supports ?category=<id> and ?search=<text>
// @route   GET /api/menu-items
// @access  Private
const getMenuItems = async (req, res, next) => {
  try {
    const restaurant = await getOwnedRestaurant(req.user._id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const query = { restaurantId: restaurant._id };

    if (req.query.category) {
      query.categoryId = req.query.category;
    }

    if (req.query.search) {
      // Case-insensitive partial match on name (simple and fast enough for
      // a single restaurant's menu; no need for a text index at this scale).
      query.name = { $regex: req.query.search.trim(), $options: 'i' };
    }

    const items = await MenuItem.find(query).sort({ order: 1, createdAt: 1 });

    res.status(200).json({ items });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single menu item
// @route   GET /api/menu-items/:id
// @access  Private
const getMenuItem = async (req, res, next) => {
  try {
    const restaurant = await getOwnedRestaurant(req.user._id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const item = await MenuItem.findOne({ _id: req.params.id, restaurantId: restaurant._id });
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json({ item });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a menu item (optionally with an image in the same request)
// @route   POST /api/menu-items
// @access  Private
const createMenuItem = async (req, res, next) => {
  try {
    const { name, description, price, categoryId, dietType, isAvailable, isFeatured } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Item name is required' });
    }
    if (price === undefined || price === null || Number(price) < 0 || Number.isNaN(Number(price))) {
      return res.status(400).json({ message: 'A valid, non-negative price is required' });
    }
    if (!categoryId) {
      return res.status(400).json({ message: 'Category is required' });
    }
    if (!['veg', 'non-veg'].includes(dietType)) {
      return res.status(400).json({ message: 'dietType must be "veg" or "non-veg"' });
    }

    const restaurant = await getOwnedRestaurant(req.user._id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Plan enforcement (Phase 9): Free is capped at a fixed number of
    // items; Pro/Business are unlimited. This is the one limit from the
    // pricing table that's simple, numeric, and safe to enforce without a
    // payment gateway behind it yet.
    const plan = getPlan(restaurant.subscriptionPlan);
    if (Number.isFinite(plan.maxMenuItems)) {
      const currentCount = await MenuItem.countDocuments({ restaurantId: restaurant._id });
      if (currentCount >= plan.maxMenuItems) {
        return res.status(403).json({
          message: `You've reached the ${plan.maxMenuItems}-item limit on the ${plan.label} plan. Upgrade for unlimited items.`,
          code: 'PLAN_LIMIT_REACHED',
        });
      }
    }

    const categoryValid = await assertCategoryBelongsToRestaurant(categoryId, restaurant._id);
    if (!categoryValid) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    let image = '';
    let imagePublicId = '';

    if (req.file) {
      const result = await uploadBufferToCloudinary(
        req.file.buffer,
        `menuqr/restaurants/${restaurant._id}/items`
      );
      image = result.secure_url;
      imagePublicId = result.public_id;
    }

    const lastItem = await MenuItem.findOne({ restaurantId: restaurant._id, categoryId }).sort({ order: -1 });
    const nextOrder = lastItem ? lastItem.order + 1 : 0;

    const item = await MenuItem.create({
      restaurantId: restaurant._id,
      categoryId,
      name: name.trim(),
      description: description?.trim() || '',
      price: Number(price),
      dietType,
      isAvailable: isAvailable === undefined ? true : isAvailable === 'true' || isAvailable === true,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      image,
      imagePublicId,
      order: nextOrder,
    });

    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a menu item's fields (not its image — use the dedicated route)
// @route   PUT /api/menu-items/:id
// @access  Private
const updateMenuItem = async (req, res, next) => {
  try {
    const restaurant = await getOwnedRestaurant(req.user._id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const item = await MenuItem.findOne({ _id: req.params.id, restaurantId: restaurant._id });
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const { name, description, price, categoryId, dietType, isAvailable, isFeatured } = req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ message: 'Item name cannot be empty' });
      }
      item.name = name.trim();
    }

    if (description !== undefined) {
      item.description = description.trim();
    }

    if (price !== undefined) {
      if (Number(price) < 0 || Number.isNaN(Number(price))) {
        return res.status(400).json({ message: 'Price must be a non-negative number' });
      }
      item.price = Number(price);
    }

    if (categoryId !== undefined) {
      const categoryValid = await assertCategoryBelongsToRestaurant(categoryId, restaurant._id);
      if (!categoryValid) {
        return res.status(400).json({ message: 'Invalid category' });
      }
      item.categoryId = categoryId;
    }

    if (dietType !== undefined) {
      if (!['veg', 'non-veg'].includes(dietType)) {
        return res.status(400).json({ message: 'dietType must be "veg" or "non-veg"' });
      }
      item.dietType = dietType;
    }

    if (isAvailable !== undefined) {
      item.isAvailable = isAvailable === 'true' || isAvailable === true;
    }

    if (isFeatured !== undefined) {
      item.isFeatured = isFeatured === 'true' || isFeatured === true;
    }

    await item.save();

    res.status(200).json({ item });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload/replace a menu item's image
// @route   POST /api/menu-items/:id/image
// @access  Private
const uploadMenuItemImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const restaurant = await getOwnedRestaurant(req.user._id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const item = await MenuItem.findOne({ _id: req.params.id, restaurantId: restaurant._id });
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const result = await uploadBufferToCloudinary(
      req.file.buffer,
      `menuqr/restaurants/${restaurant._id}/items`
    );

    const previousPublicId = item.imagePublicId;

    item.image = result.secure_url;
    item.imagePublicId = result.public_id;
    await item.save();

    await deleteFromCloudinary(previousPublicId);

    res.status(200).json({ image: item.image });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a menu item (and its Cloudinary image, if any)
// @route   DELETE /api/menu-items/:id
// @access  Private
const deleteMenuItem = async (req, res, next) => {
  try {
    const restaurant = await getOwnedRestaurant(req.user._id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const item = await MenuItem.findOneAndDelete({ _id: req.params.id, restaurantId: restaurant._id });
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    await deleteFromCloudinary(item.imagePublicId);

    res.status(200).json({ message: 'Menu item deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  uploadMenuItemImage,
  deleteMenuItem,
};
