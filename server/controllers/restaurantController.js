const Restaurant = require('../models/Restaurant');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../utils/uploadToCloudinary');
const getOwnedRestaurant = require('../utils/getOwnedRestaurant');

// Fields an owner is allowed to edit via the profile form.
// Whitelisting like this stops unexpected fields (e.g. `owner`, `slug`,
// `subscriptionPlan`) from being changed through this endpoint.
const EDITABLE_FIELDS = [
  'name',
  'description',
  'address',
  'phone',
  'whatsapp',
  'instagramUrl',
  'googleMapsUrl',
  'openingHours',
];

// @desc    Get the logged-in owner's restaurant
// @route   GET /api/restaurants/me
// @access  Private
const getMyRestaurant = async (req, res, next) => {
  try {
    // Always scope by req.user, never by an id the client could send.
    const restaurant = await getOwnedRestaurant(req.user._id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json({ restaurant });
  } catch (error) {
    next(error);
  }
};

// @desc    Update the logged-in owner's restaurant profile
// @route   PUT /api/restaurants/me
// @access  Private
const updateMyRestaurant = async (req, res, next) => {
  try {
    const restaurant = await getOwnedRestaurant(req.user._id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    EDITABLE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        restaurant[field] = req.body[field];
      }
    });

    if (!restaurant.name || !restaurant.name.trim()) {
      return res.status(400).json({ message: 'Restaurant name cannot be empty' });
    }

    await restaurant.save();

    res.status(200).json({ restaurant });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload/replace the restaurant logo
// @route   POST /api/restaurants/logo
// @access  Private
const uploadLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const restaurant = await getOwnedRestaurant(req.user._id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const result = await uploadBufferToCloudinary(
      req.file.buffer,
      `menuqr/restaurants/${restaurant._id}/logo`
    );

    // Clean up the previous logo so we don't accumulate orphaned images.
    const previousPublicId = restaurant.logoPublicId;

    restaurant.logo = result.secure_url;
    restaurant.logoPublicId = result.public_id;
    await restaurant.save();

    await deleteFromCloudinary(previousPublicId);

    res.status(200).json({ logo: restaurant.logo });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload/replace the restaurant cover image
// @route   POST /api/restaurants/cover
// @access  Private
const uploadCover = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const restaurant = await getOwnedRestaurant(req.user._id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const result = await uploadBufferToCloudinary(
      req.file.buffer,
      `menuqr/restaurants/${restaurant._id}/cover`
    );

    const previousPublicId = restaurant.coverImagePublicId;

    restaurant.coverImage = result.secure_url;
    restaurant.coverImagePublicId = result.public_id;
    await restaurant.save();

    await deleteFromCloudinary(previousPublicId);

    res.status(200).json({ coverImage: restaurant.coverImage });
  } catch (error) {
    next(error);
  }
};

// @desc    Update the logged-in owner's menu theme/customization
// @route   PUT /api/restaurants/theme
// @access  Private
const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
const VALID_THEMES = ['classic', 'modern', 'elegant'];
const VALID_BACKGROUNDS = ['white', 'soft', 'dark'];
const VALID_FONTS = ['sans', 'serif', 'rounded'];
const VALID_CARD_STYLES = ['rounded', 'minimal', 'bordered'];

const updateTheme = async (req, res, next) => {
  try {
    const { theme, primaryColor, backgroundStyle, font, cardStyle } = req.body;

    if (theme !== undefined && !VALID_THEMES.includes(theme)) {
      return res.status(400).json({ message: 'Invalid theme preset' });
    }
    if (primaryColor !== undefined && !HEX_COLOR_REGEX.test(primaryColor)) {
      return res.status(400).json({ message: 'primaryColor must be a valid hex color, e.g. #f97316' });
    }
    if (backgroundStyle !== undefined && !VALID_BACKGROUNDS.includes(backgroundStyle)) {
      return res.status(400).json({ message: 'Invalid background style' });
    }
    if (font !== undefined && !VALID_FONTS.includes(font)) {
      return res.status(400).json({ message: 'Invalid font selection' });
    }
    if (cardStyle !== undefined && !VALID_CARD_STYLES.includes(cardStyle)) {
      return res.status(400).json({ message: 'Invalid card style' });
    }

    const restaurant = await getOwnedRestaurant(req.user._id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    if (theme !== undefined) restaurant.theme = theme;
    if (primaryColor !== undefined) restaurant.primaryColor = primaryColor;
    if (backgroundStyle !== undefined) restaurant.backgroundStyle = backgroundStyle;
    if (font !== undefined) restaurant.font = font;
    if (cardStyle !== undefined) restaurant.cardStyle = cardStyle;

    await restaurant.save();

    res.status(200).json({ restaurant });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyRestaurant, updateMyRestaurant, uploadLogo, uploadCover, updateTheme };
