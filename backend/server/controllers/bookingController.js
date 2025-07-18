const Booking = require('../models/Booking');
const { validationResult } = require('express-validator');

/**
 * Create a new booking
 * @route POST /api/bookings
 * @access Public
 */
const createBooking = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      userId,
      movieId,
      showId,
      seats,
      totalAmount,
      paymentMethod,
      bookingDate
    } = req.body;

    // Create new booking
    const booking = new Booking({
      userId,
      movieId,
      showId,
      seats,
      totalAmount,
      paymentMethod,
      bookingDate: bookingDate || new Date(),
      status: 'confirmed'
    });

    const savedBooking = await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: savedBooking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating booking',
      error: error.message
    });
  }
};

/**
 * Get all bookings with optional filtering
 * @route GET /api/bookings
 * @access Public
 */
const getBookings = async (req, res) => {
  try {
    const {
      userId,
      movieId,
      status,
      page = 1,
      limit = 10,
      sortBy = 'bookingDate',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (userId) filter.userId = userId;
    if (movieId) filter.movieId = movieId;
    if (status) filter.status = status;

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Execute query with filters, pagination, and sorting
    const bookings = await Booking.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email')
      .populate('movieId', 'title genre duration')
      .populate('showId', 'showTime theater screen');

    // Get total count for pagination
    const totalBookings = await Booking.countDocuments(filter);
    const totalPages = Math.ceil(totalBookings / limit);

    res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalBookings,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings',
      error: error.message
    });
  }
};

/**
 * Get a single booking by ID
 * @route GET /api/bookings/:id
 * @access Public
 */
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID format'
      });
    }

    const booking = await Booking.findById(id)
      .populate('userId', 'name email phone')
      .populate('movieId', 'title genre duration poster rating')
      .populate('showId', 'showTime theater screen price');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking retrieved successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking',
      error: error.message
    });
  }
};

/**
 * Update a booking
 * @route PUT /api/bookings/:id
 * @access Public
 */
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID format'
      });
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Remove immutable fields from updates
    delete updates._id;
    delete updates.__v;
    delete updates.createdAt;

    // Add updated timestamp
    updates.updatedAt = new Date();

    const booking = await Booking.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true
      }
    ).populate('userId', 'name email')
     .populate('movieId', 'title genre')
     .populate('showId', 'showTime theater');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating booking',
      error: error.message
    });
  }
};

/**
 * Delete a booking
 * @route DELETE /api/bookings/:id
 * @access Public
 */
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID format'
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking can be cancelled (e.g., not within 24 hours of show)
    const showTime = new Date(booking.showId?.showTime);
    const now = new Date();
    const timeDiff = showTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    if (hoursDiff < 24 && booking.status === 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking within 24 hours of show time'
      });
    }

    await Booking.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
      data: {
        deletedBookingId: id,
        deletedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting booking',
      error: error.message
    });
  }
};

/**
 * Get booking statistics
 * @route GET /api/bookings/stats
 * @access Public
 */
const getBookingStats = async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Booking statistics retrieved successfully',
      data: {
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        statusBreakdown: stats
      }
    });
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking statistics',
      error: error.message
    });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getBookingStats
};
