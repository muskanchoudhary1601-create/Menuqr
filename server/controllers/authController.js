const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const generateTokenAndSetCookie = require('../utils/generateToken');
const { generateUniqueSlug } = require('../utils/slugify');

// @desc    Register a new owner + auto-create their restaurant
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { ownerName, restaurantName, email, phone, password, confirmPassword } = req.body;

    // --- Basic validation ---
    if (!ownerName || !restaurantName || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // --- Create the user first ---
    const user = await User.create({
      ownerName,
      email,
      phone,
      password,
    });

    // --- Auto-create their restaurant with a unique slug ---
    const slug = await generateUniqueSlug(restaurantName);

    const restaurant = await Restaurant.create({
      owner: user._id,
      name: restaurantName,
      slug,
    });

    user.restaurant = restaurant._id;
    await user.save();

    generateTokenAndSetCookie(res, user._id);

    res.status(201).json({
      user: {
        id: user._id,
        ownerName: user.ownerName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      restaurant: {
        id: restaurant._id,
        name: restaurant.name,
        slug: restaurant.slug,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log in an existing user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const restaurant = await Restaurant.findOne({ owner: user._id });

    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      user: {
        id: user._id,
        ownerName: user.ownerName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      restaurant: restaurant
        ? { id: restaurant._id, name: restaurant.name, slug: restaurant.slug }
        : null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log out the current user by clearing the auth cookie
// @route   POST /api/auth/logout
// @access  Private
const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get the currently authenticated user + their restaurant
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });

    res.status(200).json({
      user: {
        id: req.user._id,
        ownerName: req.user.ownerName,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
      },
      restaurant: restaurant
        ? { id: restaurant._id, name: restaurant.name, slug: restaurant.slug }
        : null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, getMe };
