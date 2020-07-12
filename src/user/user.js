'use strcit';
/**
 * Dependencies
 */
const Joi = require('@hapi/joi');
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

/**
 * Models with Schemas
 */
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  last_name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  phone: {
    type: String,
    unique: true,
    required: true,
    minlength: 10,
    maxlength: 15
  },
  status: {
    type: String,
    minlength: 1,
    maxlength: 255,
    default: 'Supp! Want to chat?'
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
};
const User = mongoose.model('User', userSchema);

/**
 * Functions
 *
 * Validate data provided by client
 */
function validateUser (user) {
  const schema = {
    first_name: Joi.string().min(2).max(50),
    last_name: Joi.string().min(3).max(50),
    phone: Joi.string().min(10).max(15),
    status: Joi.string().min(1).max(255),
    password: Joi.string().min(5).max(255)
  };
  return Joi.validate(user, schema);
}

/**
 * Exports
 */
module.exports = {
  User: User,
  joiValidate: validateUser
};
