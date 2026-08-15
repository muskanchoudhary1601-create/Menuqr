require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start the HTTP server.
// We only start listening once the DB connection succeeds so the API never
// serves requests it can't actually fulfill.
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`MenuQR API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
});
