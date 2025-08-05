const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: [true, 'Seat number is required'],
    trim: true
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: [true, 'Theater reference is required']
  },
  screen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Screen',
    required: [true, 'Screen reference is required']
  },
  row: {
    type: String,
    required: [true, 'Row is required'],
    trim: true,
    uppercase: true
  },
  column: {
    type: Number,
    required: [true, 'Column number is required'],
    min: [1, 'Column number must be at least 1']
  },
  seatType: {
    type: String,
    enum: {
      values: ['regular', 'premium', 'vip', 'recliner', 'wheelchair'],
      message: 'Seat type must be one of: regular, premium, vip, recliner, wheelchair'
    },
    default: 'regular'
  },
  status: {
    type: String,
    enum: {
      values: ['available', 'booked', 'maintenance', 'blocked'],
      message: 'Status must be one of: available, booked, maintenance, blocked'
    },
    default: 'available'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  isAccessible: {
    type: Boolean,
    default: false
  },
  coordinates: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
seatSchema.index({ theater: 1, screen: 1 });
seatSchema.index({ row: 1, column: 1 });
seatSchema.index({ status: 1 });
seatSchema.index({ seatType: 1 });

// Virtual for full seat identifier
seatSchema.virtual('fullSeatId').get(function() {
  return `${this.row}${this.column}`;
});

// Instance method to check if seat is available
seatSchema.methods.isAvailable = function() {
  return this.status === 'available';
};

// Instance method to book the seat
seatSchema.methods.book = function() {
  if (!this.isAvailable()) {
    throw new Error('Seat is not available for booking');
  }
  this.status = 'booked';
  return this.save();
};

// Instance method to release the seat
seatSchema.methods.release = function() {
  if (this.status !== 'booked') {
    throw new Error('Seat is not currently booked');
  }
  this.status = 'available';
  return this.save();
};

// Static method to find available seats in a screen
seatSchema.statics.findAvailableSeats = function(screenId) {
  return this.find({
    screen: screenId,
    status: 'available'
  }).sort({ row: 1, column: 1 });
};

// Static method to find seats by type
seatSchema.statics.findByType = function(screenId, seatType) {
  return this.find({
    screen: screenId,
    seatType: seatType
  }).sort({ row: 1, column: 1 });
};

// Pre-save middleware to ensure unique seat per screen
seatSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('screen') || this.isModified('row') || this.isModified('column')) {
    const existingSeat = await this.constructor.findOne({
      screen: this.screen,
      row: this.row,
      column: this.column,
      _id: { $ne: this._id }
    });
    
    if (existingSeat) {
      const error = new Error(`Seat ${this.row}${this.column} already exists in this screen`);
      error.code = 'DUPLICATE_SEAT';
      return next(error);
    }
  }
  next();
});

// Compound unique index to prevent duplicate seats
seatSchema.index(
  { screen: 1, row: 1, column: 1 },
  { unique: true, name: 'unique_seat_per_screen' }
);

const Seat = mongoose.model('Seat', seatSchema);

module.exports = Seat;
