const mongoose = require('mongoose');

const oathAgreementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true
  },
  agreedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Ensure each user (name + mobileNumber combination) can only have one oath agreement
oathAgreementSchema.index({ name: 1, mobileNumber: 1 }, { unique: true });

module.exports = mongoose.model('OathAgreement', oathAgreementSchema);
