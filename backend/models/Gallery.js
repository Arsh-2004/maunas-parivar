const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  imagePath: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'general'
  },
  uploadedBy: {
    type: String,
    default: 'admin'
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Gallery', gallerySchema);
