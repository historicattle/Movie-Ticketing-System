const express = require('express');
const router = express.Router();
const showtimeController = require('../controllers/showtimeController');

// POST / - Create a new showtime
router.post('/', showtimeController.createShowtime);

// GET / - Get all showtimes
router.get('/', showtimeController.getShowtimes);

// GET /:id - Get showtime by ID
router.get('/:id', showtimeController.getShowtimeById);

// PUT /:id - Update showtime by ID
router.put('/:id', showtimeController.updateShowtime);

// DELETE /:id - Delete showtime by ID
router.delete('/:id', showtimeController.deleteShowtime);

module.exports = router;
