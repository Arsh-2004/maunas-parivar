const mongoose = require('mongoose');

const heritagePostSchema = new mongoose.Schema({
  titleHi: {
    type: String,
    required: true,
    trim: true
  },
  titleEn: {
    type: String,
    default: '',
    trim: true
  },
  descriptionHi: {
    type: String,
    required: true
  },
  descriptionEn: {
    type: String,
    default: ''
  },
  imagePath: {
    type: String,
    default: null
  },
  imageCaption: {
    type: String,
    default: ''
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  isBuiltIn: {
    type: Boolean,
    default: false
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HeritagePost', heritagePostSchema);
