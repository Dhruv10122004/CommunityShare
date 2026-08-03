const router = require('express').Router();

const { createBooking, updateBooking, getMyBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { bookingLimiter } = require('../middleware/rateLimiter');

router.post('/', protect, bookingLimiter, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/ping', (req, res) => {
  res.send('pong from bookings');
});
router.put('/:id', protect, updateBooking);

module.exports = router;