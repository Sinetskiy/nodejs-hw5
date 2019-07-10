const mongoose = require('mongoose');
const bCrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Имя пользователя обязательно'],
    unique: true,
  },
  hash: {
    type: String,
    required: [true, 'Пароль обязателен'],
  },
  firstName: {
    type: String,
  },
  middleName: {
    type: String,
  },
  surName: {
    type: String,
  },
  permission: {
    type: Object,
  },
  access_token: {
    type: String,
  },
});

userSchema.methods.setPassword = function(password) {
  this.hash = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

userSchema.methods.validPassword = function(password) {
  return bCrypt.compareSync(password, this.hash);
};

userSchema.methods.setToken = function(token) {
  this.access_token = token;
};

mongoose.model('User', userSchema);
