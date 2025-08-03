import express from "express";
import {createShowtime, getShowtimes, getShowtimeById,getShowtimesByMovieAndDate,updateShowtime,deleteShowtime,updateAvailableSeats} from "../controllers/showtimeController.js"; 

const router = express.Router();

// POST / - Create a new showtime
router.post('/', createShowtime);

// GET / - Get all showtimes
router.get('/', getShowtimes);

// GET /:id - Get showtime by ID
router.get('/:id', getShowtimeById);

// PUT /:id - Update showtime by ID
router.put('/:id', updateShowtime);

// DELETE /:id - Delete showtime by ID
router.delete('/:id', deleteShowtime);

export default router;
