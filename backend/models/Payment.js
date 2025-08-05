const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'razorpay', 'cash'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending',
    required: true
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  paymentGateway: {
    type: String,
    enum: ['stripe', 'paypal', 'razorpay', 'square', 'braintree']
  },
  gatewayTransactionId: {
    type: String
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed
  },
  failureReason: {
    type: String
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: {
    type: String
  },
  taxes: {
    type: Number,
    default: 0
  },
  fees: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  netAmount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date
  },
  receiptNumber: {
    type: String,
    unique: true
  },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentDetails: {
    cardLast4: String,
    cardBrand: String,
    cardExpMonth: Number,
    cardExpYear: Number
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ paymentStatus: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ paymentDate: -1 });
paymentSchema.index({ receiptNumber: 1 });

// Virtual for formatted payment date
paymentSchema.virtual('formattedPaymentDate').get(function() {
  return this.paymentDate.toLocaleDateString();
});

// Virtual for payment summary
paymentSchema.virtual('paymentSummary').get(function() {
  return {
    amount: this.amount,
    currency: this.currency,
    status: this.paymentStatus,
    method: this.paymentMethod,
    date: this.paymentDate
  };
});

// Pre-save middleware to generate receipt number
paymentSchema.pre('save', function(next) {
  if (this.isNew && !this.receiptNumber) {
    this.receiptNumber = 'RCP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

// Static method to find payments by status
paymentSchema.statics.findByStatus = function(status) {
  return this.find({ paymentStatus: status });
};

// Static method to find payments by date range
paymentSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    paymentDate: {
      $gte: startDate,
      $lte: endDate
    }
  });
};

// Instance method to mark payment as completed
paymentSchema.methods.markAsCompleted = function(transactionId) {
  this.paymentStatus = 'completed';
  this.transactionId = transactionId;
  this.paymentDate = new Date();
  return this.save();
};

// Instance method to mark payment as failed
paymentSchema.methods.markAsFailed = function(reason) {
  this.paymentStatus = 'failed';
  this.failureReason = reason;
  return this.save();
};

// Instance method to process refund
paymentSchema.methods.processRefund = function(amount, reason) {
  this.refundAmount = amount;
  this.refundReason = reason;
  this.paymentStatus = 'refunded';
  return this.save();
};

module.exports = mongoose.model('Payment', paymentSchema);
