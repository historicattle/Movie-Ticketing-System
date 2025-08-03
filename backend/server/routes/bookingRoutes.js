import express from 'express';
import {createBooking,getBookings,getBookingById,updateBooking,deleteBooking,getBookingStats} from '../controllers/bookingController.js'; 

const router = express.Router();

// POST / - Create a new booking
router.post('/', createBooking);

// GET / - Get all bookings
router.get('/', getBookings);

// GET /:id - Get booking by ID
router.get('/:id', getBookingById);

// PUT /:id - Update booking by ID
router.put('/:id', updateBooking);

// DELETE /:id - Delete booking by ID
router.delete('/:id', deleteBooking);

export default router;

