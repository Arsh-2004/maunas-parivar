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

module.exports = mongoose.model('OathAgreement', oathAgreementSchema);
