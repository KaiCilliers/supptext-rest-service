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
const personSchema = new mongoose.Schema({
  display_name: {
    type: String,
    required: true,
    minlength: 2,
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
    maxlength: 255,
    default: 'Supp! Want to chat?'
  },
  active_conversations: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  favourite_conversations: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  favourite_messages: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  favourite_persons: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  blocked_persons: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  isAdmin: {
    type: Boolean,
    default: false
  }
});
personSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
};
const Person = mongoose.model('Person', personSchema);

/**
 * Functions
 *
 * Validate data provided by client
 */
function validatePerson (person) {
  const schema = {
    display_name: Joi.string().min(2).max(50),
    phone: Joi.string().min(10).max(15),
    status: Joi.string().max(50)
  };
  return Joi.validate(person, schema);
}

/**
 * Exports
 */
module.exports = {
  Person: Person,
  joiValidate: validatePerson
};
