const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user: { 
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  photoUrl: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }]
});

module.exports = mongoose.model('Post', schema);
