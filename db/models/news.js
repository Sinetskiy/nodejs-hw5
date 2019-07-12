const mongoose = require('mongoose');
const User = require('./user');

const userSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Текст обязателен'],
  },
  theme: {
    type: String,
  },
  date: {
    type: Date,
  },
  image: {
    type: String,
  },
  userId: {
    type: String,
  }
});

module.exports = mongoose.model('News', userSchema);
