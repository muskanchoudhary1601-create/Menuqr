const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const handleUpload = require('../middleware/handleUpload');
const {
  getMyRestaurant,
  updateMyRestaurant,
  uploadLogo,
  uploadCover,
  updateTheme,
} = require('../controllers/restaurantController');

const router = express.Router();

router.use(protect); // every restaurant route requires authentication

router.get('/me', getMyRestaurant);
router.put('/me', updateMyRestaurant);
router.post('/logo', handleUpload('logo'), uploadLogo);
router.post('/cover', handleUpload('cover'), uploadCover);
router.put('/theme', updateTheme);

module.exports = router;
