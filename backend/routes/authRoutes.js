const router = require('express').Router();

const { register, login } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { deleteAccount, getProfileData } = require('../controllers/authController');
// protect is a middleware that checks if the user is authenticated
// if yes then it allows the request to proceed.
// if no then it returns a 401 unauthorized error.
// basically helps in authenticating the user before allowing access to certain routes.

router.post('/register', register); // POST /api/auth/register
router.post('/login', login); // POST /api/auth/login
router.delete('/me', protect, deleteAccount); // DELETE /api/auth/me
router.get('/profile', protect, getProfileData);
module.exports = router;
