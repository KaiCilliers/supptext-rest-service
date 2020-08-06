'use strcit';
/**
 * Dependencies
 */
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

/**
 * Models with Schemas
 */
const conversationSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  creator: { type: mongoose.Types.ObjectId },
  created_at: {
    type: Date,
    default: Date.now
  },
  direct: { type: Boolean, default: false },
  last_message: { type: mongoose.Types.ObjectId, default: '' },
  members: [{ type: mongoose.Types.ObjectId }],
  admins: [{ type: mongoose.Types.ObjectId }],
  messages: [{ type: mongoose.Types.ObjectId }]
});
const Conversation = mongoose.model('Conversation', conversationSchema);

/**
 * Functions
 *
 * Validate data provided by client
 * Multiple validates for group and private
 */
function validateConversation (conversation) {
  const schema = {
    name: Joi.string().max(50),
    description: Joi.string().max(255),
    creator: Joi.objectId().required()
  };
  return Joi.validate(conversation, schema);
}
function validatePrivateConversation (conversation) {
  const schema = {
    creator: Joi.objectId().required(),
    direct: Joi.boolean().required(),
    /** naming convension is both user IDs seperated with colon (:) */
    name: Joi.string().required()
  };
  return Joi.validate(conversation, schema);
}

/**
 * Exports
 */
module.exports = {
  Conversation: Conversation,
  joiValidate2: validateConversation,
  joiPrivateValidate: validatePrivateConversation
};
