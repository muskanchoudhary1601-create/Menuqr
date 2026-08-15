const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const handleUpload = require('../middleware/handleUpload');
const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  uploadMenuItemImage,
  deleteMenuItem,
} = require('../controllers/menuItemController');

const router = express.Router();

router.use(protect); // every menu item route requires authentication

router.get('/', getMenuItems); // supports ?category=<id>&search=<text>
router.post('/', handleUpload('image'), createMenuItem); // image is optional on create
router.get('/:id', getMenuItem);
router.put('/:id', updateMenuItem);
router.post('/:id/image', handleUpload('image'), uploadMenuItemImage);
router.delete('/:id', deleteMenuItem);

module.exports = router;
