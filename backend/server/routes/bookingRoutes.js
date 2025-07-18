const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// POST / - Create a new booking
router.post('/', bookingController.createBooking);

// GET / - Get all bookings
router.get('/', bookingController.getBookings);

// GET /:id - Get booking by ID
router.get('/:id', bookingController.getBookingById);

// PUT /:id - Update booking by ID
router.put('/:id', bookingController.updateBooking);

// DELETE /:id - Delete booking by ID
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
