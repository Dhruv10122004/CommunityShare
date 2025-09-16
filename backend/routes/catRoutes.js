const router = require('express').Router();
const { getCategories, createCategory } = require('../controllers/catController');
// const { protect } = require('../middleware/authMiddleware');

router.get('/', getCategories);
// Temporarily disable protect for testing
router.post('/', createCategory);

module.exports = router;
