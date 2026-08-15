const Category = require('../models/Category');
const getOwnedRestaurant = require('../utils/getOwnedRestaurant');

// @desc    List all categories for the logged-in owner's restaurant
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res, next) => {
  try {
    const restaurant = await getOwnedRestaurant(req.user._id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const categories = await Category.find({ restaurantId: restaurant._id }).sort({ order: 1 });

    res.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const restaurant = await getOwnedRestaurant(req.user._id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // New categories go to the end of the list by default.
    const lastCategory = await Category.findOne({ restaurantId: restaurant._id }).sort({ order: -1 });
    const nextOrder = lastCategory ? lastCategory.order + 1 : 0;

    const category = await Category.create({
      restaurantId: restaurant._id,
      name: name.trim(),
      order: nextOrder,
    });

    res.status(201).json({ category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A category with this name already exists' });
    }
    next(error);
  }
};

// @desc    Update a category's name or enabled status
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res, next) => {
  try {
    const restaurant = await getOwnedRestaurant(req.user._id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Scoping by restaurantId as well as _id ensures a user can never edit
    // another restaurant's category, even if they guess/tamper with an id.
    const category = await Category.findOne({ _id: req.params.id, restaurantId: restaurant._id });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const { name, isEnabled } = req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ message: 'Category name cannot be empty' });
      }
      category.name = name.trim();
    }

    if (isEnabled !== undefined) {
      category.isEnabled = Boolean(isEnabled);
    }

    await category.save();

    res.status(200).json({ category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A category with this name already exists' });
    }
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res, next) => {
  try {
    const restaurant = await getOwnedRestaurant(req.user._id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const category = await Category.findOneAndDelete({ _id: req.params.id, restaurantId: restaurant._id });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder categories (drag-and-drop on the frontend)
// @route   PUT /api/categories/reorder
// @access  Private
// Body shape: { order: ["categoryId1", "categoryId2", ...] } — full list of
// this restaurant's category ids, in their new display order.
const reorderCategories = async (req, res, next) => {
  try {
    const { order } = req.body;

    if (!Array.isArray(order) || order.length === 0) {
      return res.status(400).json({ message: 'order must be a non-empty array of category ids' });
    }

    const restaurant = await getOwnedRestaurant(req.user._id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Only touch categories that actually belong to this restaurant.
    const ownedCategories = await Category.find({ restaurantId: restaurant._id }).select('_id');
    const ownedIds = new Set(ownedCategories.map((c) => c._id.toString()));

    const updates = order
      .filter((id) => ownedIds.has(id))
      .map((id, index) => ({
        updateOne: {
          filter: { _id: id, restaurantId: restaurant._id },
          update: { order: index },
        },
      }));

    if (updates.length > 0) {
      await Category.bulkWrite(updates);
    }

    const categories = await Category.find({ restaurantId: restaurant._id }).sort({ order: 1 });

    res.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory, reorderCategories };
