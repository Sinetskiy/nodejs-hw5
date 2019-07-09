const User = require('../db/models/user');
const Joi = require('@hapi/joi');


const schema = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  email: Joi.string().email({ minDomainSegments: 2 })
});

const resultItemConverter = (item) => {
  return {
    id: item.id,
    username: item.username,
    email: item.email
  }
}

exports.getAll = () => new Promise(async (resolve, reject) => {
  try {
    let result = await User.find();

    resolve(result.map((item) => resultItemConverter(item)));
  }
  catch (err) {
    reject({
      message: err,
      statusCode: 500
    });
  }
});

exports.add = ({ username, email, password }) => new Promise(async (resolve, reject) => {
  try {
    const { error, value } = Joi.validate({ username, email, password }, schema);
    if (error) {
      return reject({
        message: error,
        statusCode: 400
      });
    }

    const newUser = new User({
      username,
      email,
      password
    });

    const result = await newUser.save();

    resolve(resultItemConverter(result));
  }
  catch (err) {
    reject(err);
  }
});

exports.get = ({ id }) => new Promise(async (resolve, reject) => {
  try {
    if (!id) {
      return reject('id is required');
    }

    const result = await User.findById(id);

    resolve(resultItemConverter(result));
  }
  catch (err) {
    reject(err);
  }
});

exports.update = ({ id, username, email }) => new Promise(async (resolve, reject) => {
  try {
    if (!id) {
      return reject('id is required');
    }

    const { error, value } = Joi.validate({ username, email }, schema);
    if (error) {
      return reject(error);
    }

    const user = await User.findById(id);

    user.set({
      username,
      email
    });
    const result = await user.save();

    resolve(resultItemConverter(result));
  }
  catch (err) {
    reject(err);
  }
});

exports.delete = ({ id }) => new Promise(async (resolve, reject) => {
  try {
    if (!id) {
      return reject('id is required');
    }
    await User.findByIdAndRemove(id);

    resolve(true);
  }
  catch (err) {
    reject(err);
  }
});
