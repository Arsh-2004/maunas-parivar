const mongoose = require('mongoose');

const nonMemberRecordSchema = new mongoose.Schema({
  // --------------- MANDATORY FIELDS ---------------
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  place: {
    type: String,
    required: true,
    trim: true  // city / village / hometown where the person lives
  },
  dateOfBirth: {
    type: Date,
    required: true
  },

  // --------------- OPTIONAL FIELDS ---------------
  relationship: {
    type: String,
    trim: true,
    default: ''  // e.g. "Brother", "Sister", "Parent", "Friend"
  },
  fatherName: {
    type: String,
    trim: true,
    default: ''
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', ''],
    default: ''
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  village: {
    type: String,
    trim: true,
    default: ''
  },
  block: {
    type: String,
    trim: true,
    default: ''
  },
  tehsil: {
    type: String,
    trim: true,
    default: ''
  },
  district: {
    type: String,
    trim: true,
    default: ''
  },
  state: {
    type: String,
    trim: true,
    default: ''
  },
  pincode: {
    type: String,
    trim: true,
    default: ''
  },
  occupation: {
    type: String,
    trim: true,
    default: ''
  },
  education: {
    type: String,
    default: ''
  },
  photoPath: {
    type: String,
    default: null
  },

  // --------------- META ---------------
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('NonMemberRecord', nonMemberRecordSchema);
