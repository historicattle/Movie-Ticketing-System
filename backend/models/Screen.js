const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  screenNumber: {
    type: Number,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true
  },
  seatLayout: {
    type: [[String]], // 2D array representing seat layout
    required: true
  },
  amenities: {
    type: [String],
    default: []
  },
  screenType: {
    type: String,
    enum: ['2D', '3D', 'IMAX', '4DX'],
    default: '2D'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create indexes
screenSchema.index({ theater: 1, screenNumber: 1 }, { unique: true });

module.exports = mongoose.model('Screen', screenSchema);
