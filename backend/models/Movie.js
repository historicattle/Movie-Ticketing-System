const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true,
    maxlength: [200, 'Movie title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Movie description is required'],
    trim: true,
    maxlength: [1000, 'Movie description cannot exceed 1000 characters']
  },
  genre: {
    type: [String],
    required: [true, 'At least one genre is required'],
    enum: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Thriller', 'Animation', 'Documentary', 'Biography', 'Crime', 'Family', 'History', 'Music', 'Sci-Fi', 'Sport', 'War', 'Western']
  },
  director: {
    type: String,
    required: [true, 'Director name is required'],
    trim: true,
    maxlength: [100, 'Director name cannot exceed 100 characters']
  },
  cast: {
    type: [String],
    required: [true, 'At least one cast member is required'],
    validate: {
      validator: function(cast) {
        return cast.length > 0;
      },
      message: 'Movie must have at least one cast member'
    }
  },
  duration: {
    type: Number,
    required: [true, 'Movie duration is required'],
    min: [1, 'Duration must be at least 1 minute'],
    max: [600, 'Duration cannot exceed 600 minutes']
  },
  language: {
    type: String,
    required: [true, 'Movie language is required'],
    trim: true,
    maxlength: [50, 'Language cannot exceed 50 characters']
  },
  country: {
    type: String,
    required: [true, 'Country of origin is required'],
    trim: true,
    maxlength: [50, 'Country cannot exceed 50 characters']
  },
  releaseDate: {
    type: Date,
    required: [true, 'Release date is required']
  },
  rating: {
    type: String,
    required: [true, 'Movie rating is required'],
    enum: {
      values: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'U', 'UA', 'A'],
      message: 'Rating must be one of: G, PG, PG-13, R, NC-17, U, UA, A'
    }
  },
  imdbRating: {
    type: Number,
    min: [0, 'IMDB rating cannot be negative'],
    max: [10, 'IMDB rating cannot exceed 10'],
    default: 0
  },
  poster: {
    type: String,
    required: [true, 'Movie poster URL is required'],
    trim: true
  },
  trailer: {
    type: String,
    trim: true
  },
  budget: {
    type: Number,
    min: [0, 'Budget cannot be negative']
  },
  boxOffice: {
    type: Number,
    min: [0, 'Box office collection cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isNowShowing: {
    type: Boolean,
    default: false
  },
  isComingSoon: {
    type: Boolean,
    default: false
  },
  theaters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater'
  }],
  showtimes: [{
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
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Ticket price cannot be negative']
    },
    availableSeats: {
      type: Number,
      required: true,
      min: [0, 'Available seats cannot be negative']
    },
    totalSeats: {
      type: Number,
      required: true,
      min: [1, 'Total seats must be at least 1']
    }
  }],
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'Review comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Average rating cannot be negative'],
    max: [5, 'Average rating cannot exceed 5']
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: [0, 'Total reviews cannot be negative']
  },
  tags: {
    type: [String],
    default: []
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
movieSchema.index({ title: 1 });
movieSchema.index({ genre: 1 });
movieSchema.index({ releaseDate: -1 });
movieSchema.index({ isActive: 1, isNowShowing: 1 });
movieSchema.index({ averageRating: -1 });
movieSchema.index({ 'showtimes.date': 1, 'showtimes.theater': 1 });

// Virtual for movie age
movieSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.releaseDate) / 86400000);
});

// Virtual for formatted duration
movieSchema.virtual('formattedDuration').get(function() {
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  return `${hours}h ${minutes}m`;
});

// Pre-save middleware to update average rating
movieSchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = Number((totalRating / this.reviews.length).toFixed(1));
    this.totalReviews = this.reviews.length;
  }
  next();
});

// Method to add a review
movieSchema.methods.addReview = function(userId, rating, comment) {
  const existingReviewIndex = this.reviews.findIndex(
    review => review.user.toString() === userId.toString()
  );
  
  if (existingReviewIndex !== -1) {
    // Update existing review
    this.reviews[existingReviewIndex].rating = rating;
    this.reviews[existingReviewIndex].comment = comment;
    this.reviews[existingReviewIndex].createdAt = new Date();
  } else {
    // Add new review
    this.reviews.push({
      user: userId,
      rating,
      comment,
      createdAt: new Date()
    });
  }
  
  return this.save();
};

// Method to remove a review
movieSchema.methods.removeReview = function(userId) {
  this.reviews = this.reviews.filter(
    review => review.user.toString() !== userId.toString()
  );
  return this.save();
};

// Method to check if movie is currently showing
movieSchema.methods.isCurrentlyShowing = function() {
  const now = new Date();
  return this.showtimes.some(showtime => {
    const showtimeDate = new Date(showtime.date);
    return showtimeDate >= now && showtime.availableSeats > 0;
  });
};

// Static method to find movies by genre
movieSchema.statics.findByGenre = function(genre) {
  return this.find({ genre: { $in: [genre] }, isActive: true });
};

// Static method to find now showing movies
movieSchema.statics.findNowShowing = function() {
  return this.find({ isNowShowing: true, isActive: true });
};

// Static method to find coming soon movies
movieSchema.statics.findComingSoon = function() {
  return this.find({ isComingSoon: true, isActive: true });
};

// Static method to find popular movies
movieSchema.statics.findPopular = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ averageRating: -1, totalReviews: -1 })
    .limit(limit);
};

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
