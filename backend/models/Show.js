const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true
  },
  screen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Screen',
    required: true
  },
  showTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 0
  },
  totalSeats: {
    type: Number,
    required: true,
    min: 1
  },
  bookedSeats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seat'
  }],
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active'
  },
  language: {
    type: String,
    required: true
  },
  format: {
    type: String,
    enum: ['2D', '3D', 'IMAX', '4DX'],
    default: '2D'
  }
}, {
  timestamps: true
});

// Index for efficient queries
showSchema.index({ theater: 1, showTime: 1 });
showSchema.index({ movie: 1, showTime: 1 });
showSchema.index({ showTime: 1, status: 1 });

// Virtual for duration calculation
showSchema.virtual('duration').get(function() {
  return this.endTime - this.showTime;
});

// Method to check if show is bookable
showSchema.methods.isBookable = function() {
  const now = new Date();
  const showTime = new Date(this.showTime);
  const timeDiff = showTime - now;
  const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
  
  return this.status === 'active' && 
         this.availableSeats > 0 && 
         timeDiff > thirtyMinutes;
};

// Method to update available seats
showSchema.methods.updateAvailableSeats = function() {
  this.availableSeats = this.totalSeats - this.bookedSeats.length;
  return this.save();
};

// Static method to find shows by date range
showSchema.statics.findByDateRange = function(startDate, endDate, movieId = null) {
  const query = {
    showTime: {
      $gte: startDate,
      $lte: endDate
    },
    status: 'active'
  };
  
  if (movieId) {
    query.movie = movieId;
  }
  
  return this.find(query).populate('movie theater screen');
};

// Pre-save middleware to calculate end time if not provided
showSchema.pre('save', async function(next) {
  if (this.isModified('showTime') || this.isModified('movie')) {
    if (!this.endTime && this.movie) {
      // Populate movie to get duration
      await this.populate('movie');
      if (this.movie && this.movie.duration) {
        const showTime = new Date(this.showTime);
        this.endTime = new Date(showTime.getTime() + (this.movie.duration * 60000)); // duration in minutes
      }
    }
  }
  next();
});

module.exports = mongoose.model('Show', showSchema);
