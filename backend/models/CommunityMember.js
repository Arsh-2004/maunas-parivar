const mongoose = require('mongoose');

const communityMemberSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  designation: {
    type: String,
    default: '',
    trim: true
  },
  occupation: {
    type: String,
    default: '',
    trim: true
  },
  city: {
    type: String,
    default: '',
    trim: true
  },
  state: {
    type: String,
    default: '',
    trim: true
  },
  bio: {
    type: String,
    default: ''
  },
  awards: {
    type: String,
    default: ''
  },
  publications: {
    type: String,
    default: ''
  },
  photoPath: {
    type: String,
    default: null
  },
  // Either honoraryTitle OR prakosth must be set
  honoraryTitle: {
    type: String,
    enum: ['मौनस शिरोमणि', 'मौनस कुबेर', 'मौनस रत्न', 'मौनस कुलभूषण', 'मौनस कुलदीपक', 'मौनस नायक', null],
    default: null
  },
  prakosth: {
    type: String,
    enum: [
      'buddhijivi', 'manav-seva', 'chikitsa', 'vidhi',
      'vyapar', 'kisaan', 'khel', 'yuva', 'mahila', 'veerangana', null
    ],
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

module.exports = mongoose.model('CommunityMember', communityMemberSchema);
