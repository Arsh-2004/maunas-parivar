const mongoose = require('mongoose');

const sahyogSubmissionSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    default: '',
    trim: true
  },
  amount: {
    type: Number,
    default: null
  },
  message: {
    type: String,
    default: '',
    trim: true
  },
  screenshotPath: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  reviewedAt: {
    type: Date,
    default: null
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SahyogSubmission', sahyogSubmissionSchema);
