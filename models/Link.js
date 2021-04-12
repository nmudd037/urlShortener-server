const mongoose = require('mongoose');

// Link Schema
const linkSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  shortenUrlId: {
    type: String,
    unique: true,
    required: true
  },
  visitors: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Link Model
const Link = mongoose.model('Link', linkSchema);

module.exports = Link;
