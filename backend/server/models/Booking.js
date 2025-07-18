const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  showtime: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Showtime',
    required: true
  },
  seats: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'booked'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
