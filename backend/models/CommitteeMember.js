const mongoose = require('mongoose');

const committeeMemberSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  designation: { type: String, default: '', trim: true },
  position: { type: String, default: '', trim: true },
  city: { type: String, default: '', trim: true },
  state: { type: String, default: '', trim: true },
  photoPath: { type: String, default: null },
  committee: {
    type: String,
    enum: ['sanrakshak', 'prabandhan', 'sanchalan'],
    required: true
  },
  displayPage: {
    type: String,
    enum: ['about', 'home', 'both'],
    default: 'about'
  },
  sortOrder: { type: Number, default: 0 },
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CommitteeMember', committeeMemberSchema);
