const router = require('express').Router();
console.log('Booking routes loaded'); // For debugging purposes, can be removed later
const { createBooking, updateBooking, getMyBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/ping', (req, res) => {
  res.send('pong from bookings');
});
router.put('/:id', protect, updateBooking);
// This route is for testing purposes, it can be removed later

module.exports = router;