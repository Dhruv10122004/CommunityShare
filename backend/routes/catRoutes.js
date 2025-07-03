const router = require('express').Router();
const { getCategories, createCategory } = require('../controllers/catController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getCategories);
router.post('/', protect, createCategory);

module.exports = router;