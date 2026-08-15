const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const compression = require('compression');

const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const menuItemRoutes = require('./routes/menuItemRoutes');
const publicRoutes = require('./routes/publicRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const billingRoutes = require('./routes/billingRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// --- Production HTTP Compression ---
app.use(compression());

// --- Security & core middleware ---
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://checkout.razorpay.com'],
        frameSrc: ["'self'", 'https://api.razorpay.com', 'https://checkout.razorpay.com'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:', 'http:'],
        connectSrc: [
          "'self'",
          'https://api.razorpay.com',
          'https://lumberjack.razorpay.com',
          'https://*.razorpay.com',
        ],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);


const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  'http://127.0.0.1:5176',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman, same-origin)
      if (!origin) return callback(null, true);

      // In development or if origin is from localhost / 127.0.0.1 or in allowed list
      if (
        allowedOrigins.includes(origin) ||
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(origin) ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, origin);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true, // allow HTTP-only cookies to be sent
  })
);
app.use(
  express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'MenuQR API is running' });
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes); // Phase 2: restaurant profile
app.use('/api/categories', categoryRoutes); // Phase 3: menu categories
app.use('/api/menu-items', menuItemRoutes); // Phase 4: menu items
app.use('/api/public', publicRoutes); // Phase 5: public digital menu (no auth)
app.use('/api/analytics', analyticsRoutes); // Phase 8: basic analytics
app.use('/api/billing', billingRoutes); // Phase 9: subscription plan architecture

// --- Error handling ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
