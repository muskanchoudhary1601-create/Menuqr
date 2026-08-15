const Restaurant = require('../models/Restaurant');

// Shared helper: looks up the restaurant belonging to the authenticated
// user. Centralizing this means every controller that needs "the current
// user's restaurant" derives it the same safe way — from req.user, never
// from a client-supplied restaurantId.
const getOwnedRestaurant = async (userId) => {
  return Restaurant.findOne({ owner: userId });
};

module.exports = getOwnedRestaurant;
