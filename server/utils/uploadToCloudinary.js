const cloudinary = require('../config/cloudinary');

// Streams an in-memory file buffer (from multer.memoryStorage) up to
// Cloudinary and resolves with the secure URL + public_id.
// `folder` keeps logos/covers organized per restaurant, e.g.
// "menuqr/restaurants/<restaurantId>/logo".
const uploadBufferToCloudinary = (buffer, folder) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
    // Fallback in local development if Cloudinary credentials are not set yet
    const base64 = buffer.toString('base64');
    return Promise.resolve({
      secure_url: `data:image/jpeg;base64,${base64}`,
      public_id: `local_dev_${Date.now()}`,
    });
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};


// Deletes a previously uploaded image by its Cloudinary public_id.
// Safe to call even if publicId is empty/undefined (no-op).
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    // Non-fatal: if the old image can't be deleted (e.g. already gone),
    // we don't want that to block the new upload from succeeding.
    console.error('Cloudinary delete failed:', error.message);
  }
};

module.exports = { uploadBufferToCloudinary, deleteFromCloudinary };
