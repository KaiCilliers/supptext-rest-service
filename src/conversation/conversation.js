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
  last_message: { type: mongoose.Types.ObjectId },
  members: [{ type: mongoose.Types.ObjectId }],
  admins: [{ type: mongoose.Types.ObjectId }],
  messages: [{ type: mongoose.Types.ObjectId }]
});
const Conversation = mongoose.model('Conversation', conversationSchema);

/**
 * Functions
 *
 * Validate data provided by client
 */
function validateConversation (conversation) {
  const schema = {
    name: Joi.String().max(50),
    description: Joi.String().max(255),
    creator: Joi.string(),
    created_at: Joi.date(),
    last_message: Joi.string(),
    members: Joi.array.items(Joi.string()),
    admins: Joi.array.items(Joi.string()),
    messsages: Joi.array.items(Joi.string())
  };
  return Joi.validate(conversation, schema);
}

/**
 * Exports
 */
module.exports = {
  Conversation: Conversation,
  joiValidate: validateConversation
};
