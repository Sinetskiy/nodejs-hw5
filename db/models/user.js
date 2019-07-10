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
    set: i => (i === '' ? 'Anonim' + new Date() : i),
  },
  middleName: {
    type: String,
    set: i => (i === '' ? 'Anonim' + new Date() : i),
  },
  surName: {
    type: String,
    set: i => (i === '' ? 'Anonim' + new Date() : i),
  },
  permission: {
    type: Object,
  },
  token: {
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
  this.token = token;
};

mongoose.model('User', userSchema);
