const express = require('express');
const rateLimit = require('express-rate-limit');
const { getPublicMenu } = require('../controllers/publicController');

const router = express.Router();

// Generous but present — this endpoint has no auth, so it needs its own
// protection against scraping/abuse. 120 requests/minute comfortably covers
// real customers scanning a QR code and refreshing the page.
const publicMenuLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

// No `protect` middleware — this is the page customers see after scanning
// a QR code, so it must work without logging in.
router.get('/menu/:slug', publicMenuLimiter, getPublicMenu);

module.exports = router;
