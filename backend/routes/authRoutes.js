const router = require('express').Router();

const { register, login, deleteAccount, getProfileData } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.delete('/me', protect, deleteAccount);
router.get('/profile', protect, getProfileData);

module.exports = router;
