const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protects routes by verifying the JWT stored in the HTTP-only cookie.
// On success, attaches the authenticated user (without password) to req.user.
const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // Support Bearer token in Authorization header for cross-domain setups (Vercel + Render)
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

module.exports = { protect };
