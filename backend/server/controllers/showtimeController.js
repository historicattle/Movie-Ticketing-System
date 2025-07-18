// Showtime Controller - CRUD operations for movie showtimes
const Showtime = require('../models/Showtime');

// Create a new showtime
const createShowtime = async (req, res) => {
  try {
    const { movieId, theaterId, showDate, showTime, price, availableSeats } = req.body;
    
    // Validate required fields
    if (!movieId || !theaterId || !showDate || !showTime || !price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: movieId, theaterId, showDate, showTime, price'
      });
    }

    const showtime = new Showtime({
      movieId,
      theaterId,
      showDate,
      showTime,
      price,
      availableSeats: availableSeats || 100 // Default to 100 seats if not provided
    });

    const savedShowtime = await showtime.save();
    
    res.status(201).json({
      success: true,
      message: 'Showtime created successfully',
      data: savedShowtime
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating showtime',
      error: error.message
    });
  }
};

// Get all showtimes with optional filters
const getShowtimes = async (req, res) => {
  try {
    const { movieId, theaterId, showDate, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (movieId) filter.movieId = movieId;
    if (theaterId) filter.theaterId = theaterId;
    if (showDate) filter.showDate = new Date(showDate);

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    const showtimes = await Showtime.find(filter)
      .populate('movieId', 'title duration genre rating')
      .populate('theaterId', 'name location')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ showDate: 1, showTime: 1 });
    
    const total = await Showtime.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      message: 'Showtimes retrieved successfully',
      data: {
        showtimes,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: showtimes.length,
          totalRecords: total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving showtimes',
      error: error.message
    });
  }
};

// Get a single showtime by ID
const getShowtimeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const showtime = await Showtime.findById(id)
      .populate('movieId', 'title duration genre rating poster')
      .populate('theaterId', 'name location address phone');
    
    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: 'Showtime not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Showtime retrieved successfully',
      data: showtime
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving showtime',
      error: error.message
    });
  }
};

// Update a showtime
const updateShowtime = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Remove fields that shouldn't be updated
    delete updates._id;
    delete updates.__v;
    delete updates.createdAt;
    
    const showtime = await Showtime.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('movieId', 'title duration genre rating')
     .populate('theaterId', 'name location');
    
    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: 'Showtime not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Showtime updated successfully',
      data: showtime
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating showtime',
      error: error.message
    });
  }
};

// Delete a showtime
const deleteShowtime = async (req, res) => {
  try {
    const { id } = req.params;
    
    const showtime = await Showtime.findByIdAndDelete(id);
    
    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: 'Showtime not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Showtime deleted successfully',
      data: {
        deletedShowtime: showtime
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting showtime',
      error: error.message
    });
  }
};

// Additional utility functions

// Get showtimes by movie and date
const getShowtimesByMovieAndDate = async (req, res) => {
  try {
    const { movieId, date } = req.params;
    
    const showtimes = await Showtime.find({
      movieId,
      showDate: new Date(date)
    })
    .populate('theaterId', 'name location')
    .sort({ showTime: 1 });
    
    res.status(200).json({
      success: true,
      message: 'Showtimes retrieved successfully',
      data: showtimes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving showtimes',
      error: error.message
    });
  }
};

// Update available seats (for booking system)
const updateAvailableSeats = async (req, res) => {
  try {
    const { id } = req.params;
    const { seatsToBook } = req.body;
    
    const showtime = await Showtime.findById(id);
    
    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: 'Showtime not found'
      });
    }
    
    if (showtime.availableSeats < seatsToBook) {
      return res.status(400).json({
        success: false,
        message: 'Not enough seats available'
      });
    }
    
    showtime.availableSeats -= seatsToBook;
    await showtime.save();
    
    res.status(200).json({
      success: true,
      message: 'Seats updated successfully',
      data: {
        availableSeats: showtime.availableSeats,
        bookedSeats: seatsToBook
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating seats',
      error: error.message
    });
  }
};

module.exports = {
  createShowtime,
  getShowtimes,
  getShowtimeById,
  updateShowtime,
  deleteShowtime,
  getShowtimesByMovieAndDate,
  updateAvailableSeats
};
