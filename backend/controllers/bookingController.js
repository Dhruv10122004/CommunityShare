const bookingModel = require('../models/bookingModel');

exports.createBooking = async (req, res) => {
    try {
        const booking = await bookingModel.createBooking({
            ...req.body,
            borrower_id: req.user.id
        });
        return res.status(201).json(booking);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await bookingModel.updateBookingStatus(id, status);
        return res.json(updated);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.getUserBookings(req.user.id);
        return res.json(bookings);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};