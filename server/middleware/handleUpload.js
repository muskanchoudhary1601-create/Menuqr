const multer = require('multer');
const upload = require('./uploadMiddleware');

// Wraps a single-file multer upload so file-size/type errors come back as
// clean JSON instead of an unhandled exception. Shared across any route
// that accepts an image upload (restaurant logo/cover, menu item photos).
const handleUpload = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Image must be smaller than 5MB' });
      }
      return res.status(400).json({ message: err.message });
    }
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

module.exports = handleUpload;
