const router = require('express').Router();

const { sendMessage, getConversation, getAllThreadsForUser } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, sendMessage); 
router.get('/', protect, getAllThreadsForUser);
router.get('/:userId', protect, getConversation);

module.exports = router;