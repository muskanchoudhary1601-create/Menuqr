const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} = require('../controllers/categoryController');

const router = express.Router();

router.use(protect); // every category route requires authentication

router.get('/', getCategories);
router.post('/', createCategory);
router.put('/reorder', reorderCategories); // must come before '/:id' to avoid being shadowed
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
