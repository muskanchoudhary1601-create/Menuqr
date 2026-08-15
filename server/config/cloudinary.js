const { v2: cloudinary } = require('cloudinary');

// Configures the Cloudinary SDK from env vars. Called once on startup;
// individual controllers just import `cloudinary` and use it directly.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
