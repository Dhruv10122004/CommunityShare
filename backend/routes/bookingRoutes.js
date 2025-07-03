const router = require('express').Router();
console.log('Booking routes loaded'); // For debugging purposes, can be removed later
const { createBooking, updateBooking, getMyBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.put('/:id', protect, updateBooking);
router.get('/my', protect, getMyBookings);
router.get('/ping', (req, res) => {
  res.send('pong from bookings');
});
// This route is for testing purposes, it can be removed later

module.exports = router;