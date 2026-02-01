const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  fatherName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  village: {
    type: String,
    required: true,
    trim: true
  },
  block: {
    type: String,
    required: true,
    trim: true
  },
  tehsil: {
    type: String,
    required: true,
    trim: true
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    trim: true
  },
  occupation: {
    type: String,
    required: true,
    trim: true
  },
  education: {
    type: String,
    required: true,
    enum: ['below-10th', '10th', '12th', 'graduate', 'post-graduate', 'diploma', 'others']
  },
  idProofPath: {
    type: String,
    required: true
  },
  addressProofPath: {
    type: String,
    required: true
  },
  photoPath: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  donationDocumentPath: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  membershipTier: {
    type: String,
    enum: ['silver', 'gold', 'diamond'],
    default: 'silver'
  },
  rejectionReason: {
    type: String,
    default: null
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date,
    default: null
  },
  idCardPath: {
    type: String,
    default: null
  },
  idCardGeneratedAt: {
    type: Date,
    default: null
  },
  committee: {
    type: String,
    enum: ['संरक्षक कमेटी', 'प्रबन्धन कमेटी', 'संचालक कमेटी'],
    default: null
  },
  position: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('User', userSchema);
