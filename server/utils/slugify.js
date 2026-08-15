const Restaurant = require('../models/Restaurant');

// Turns "Cafe Mocha!" into "cafe-mocha"
const baseSlugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

// Generates a unique slug for a restaurant name by appending -2, -3, etc.
// if the base slug is already taken.
const generateUniqueSlug = async (name) => {
  const base = baseSlugify(name) || 'restaurant';
  let slug = base;
  let counter = 2;

  // eslint-disable-next-line no-await-in-loop
  while (await Restaurant.exists({ slug })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
};

module.exports = { baseSlugify, generateUniqueSlug };
