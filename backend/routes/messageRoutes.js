const router = require('express').Router();

const { sendMessage, getConversation, getAllThreadsForUser } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const { messageLimiter } = require('../middleware/rateLimiter');

router.post('/', protect, messageLimiter, sendMessage);
router.get('/', protect, getAllThreadsForUser);
router.get('/:userId', protect, getConversation);

module.exports = router;