const router = require('express').Router();

const { addReview, getReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
// protect is a middleware that checks if the user is authenticated and restricts
// access to certain routes if not authenticated.

router.post('/', protect, addReview); 
router.get('/:userId', getReviews); // Note the colon before userId to indicate a route parameter

module.exports = router;