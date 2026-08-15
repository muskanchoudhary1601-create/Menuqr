const multer = require('multer');

// Files are held in memory only long enough to stream them to Cloudinary —
// we never write uploads to disk.
const storage = multer.memoryStorage();

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, and WEBP images are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

module.exports = upload;
