const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contactInfo: {
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    website: String
  },
  screens: [{
    screenNumber: {
      type: Number,
      required: true
    },
    screenName: {
      type: String,
      required: true
    },
    capacity: {
      type: Number,
      required: true,
      min: 1
    },
    screenType: {
      type: String,
      enum: ['2D', '3D', 'IMAX', '4DX', 'Dolby Atmos'],
      default: '2D'
    },
    amenities: [{
      type: String,
      enum: ['AC', 'Recliner Seats', 'Food Service', 'Premium Sound', 'Wheelchair Accessible']
    }]
  }],
  facilities: [{
    type: String,
    enum: ['Parking', 'Food Court', 'Restrooms', 'Gift Shop', 'ATM', 'Wheelchair Access', 'Baby Care Room']
  }],
  operatingHours: {
    monday: {
      open: String,
      close: String,
      isClosed: { type: Boolean, default: false }
    },
    tuesday: {
      open: String,
      close: String,
      isClosed: { type: Boolean, default: false }
    },
    wednesday: {
      open: String,
      close: String,
      isClosed: { type: Boolean, default: false }
    },
    thursday: {
      open: String,
      close: String,
      isClosed: { type: Boolean, default: false }
    },
    friday: {
      open: String,
      close: String,
      isClosed: { type: Boolean, default: false }
    },
    saturday: {
      open: String,
      close: String,
      isClosed: { type: Boolean, default: false }
    },
    sunday: {
      open: String,
      close: String,
      isClosed: { type: Boolean, default: false }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for location-based queries
theaterSchema.index({ 'location.city': 1, 'location.state': 1 });

// Index for geospatial queries
theaterSchema.index({ 'location.coordinates': '2dsphere' });

// Virtual for total capacity
theaterSchema.virtual('totalCapacity').get(function() {
  return this.screens.reduce((total, screen) => total + screen.capacity, 0);
});

// Virtual for total screens
theaterSchema.virtual('totalScreens').get(function() {
  return this.screens.length;
});

// Pre-save middleware to update updatedAt
theaterSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to get available screen types
theaterSchema.methods.getAvailableScreenTypes = function() {
  return [...new Set(this.screens.map(screen => screen.screenType))];
};

// Method to find screens by type
theaterSchema.methods.getScreensByType = function(screenType) {
  return this.screens.filter(screen => screen.screenType === screenType);
};

// Method to check if theater is open on a given day
theaterSchema.methods.isOpenOnDay = function(dayName) {
  const day = dayName.toLowerCase();
  const daySchedule = this.operatingHours[day];
  return daySchedule && !daySchedule.isClosed && daySchedule.open && daySchedule.close;
};

// Static method to find theaters by city
theaterSchema.statics.findByCity = function(city) {
  return this.find({ 
    'location.city': new RegExp(city, 'i'),
    isActive: true 
  });
};

// Static method to find theaters near coordinates
theaterSchema.statics.findNearby = function(latitude, longitude, maxDistance = 10000) {
  return this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    },
    isActive: true
  });
};

module.exports = mongoose.model('Theater', theaterSchema);
