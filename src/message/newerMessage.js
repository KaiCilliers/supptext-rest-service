'use strcit';
/**
 * Dependencies
 */
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

/**
 * Schema and Model
 */
const betterMessageSchema = new mongoose.Schema({
  converstaion: { type: mongoose.Types.ObjectId, required: true },
  author: { type: mongoose.Types.ObjectId, required: true },
  body: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 255
  },
  sent: {
    type: Boolean,
    required: true,
    default: false
  },
  received: {
    type: Boolean,
    required: true,
    default: false
  },
  read: {
    type: Boolean,
    required: true,
    default: false
  },
  deleted: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  forward_count: {
    type: Number,
    default: 0
  }
});
const BetterMessage = mongoose.model('BetterMesssage', betterMessageSchema);

/**
 * Functions
 *
 * Validate data provided by client
 */
function validateBetterMessage (betterMessage) {
  const schema = {
    userId: Joi.objectId().required(),
    roomId: Joi.objectId().required(),
    content: Joi.string().min(1).max(255).required()
  };
  return Joi.validate(betterMessage, schema);
}

/**
 * Exports
 */
module.exports = {
  BetterMessage: BetterMessage,
  joiValidate: validateBetterMessage
};
