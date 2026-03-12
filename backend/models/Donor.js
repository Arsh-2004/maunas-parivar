const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    default: ''
  },
  donationAmount: {
    type: Number,
    required: true
  },
  donationPurpose: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  photoPath: {
    type: String,
    default: null
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  sortOrder: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Donor', donorSchema);
