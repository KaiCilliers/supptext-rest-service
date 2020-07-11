/**
 * Dependencies
 */
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

/**
 * Models with Schemas
 */
const participantSchema = new mongoose.Schema({
  room: {
    type: new mongoose.Schema({
      private: {
        type: Boolean,
        required: true
      },
      last_message: {
        type: Date
      }
    })
  },
  user: {
    type: new mongoose.Schema({
      first_name: {
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
      }
    })
  },
  admin: {
    type: Boolean,
    required: true,
    default: false
  },
  creator: {
    type: Boolean,
    required: true,
    default: false
  }
});
const Participant = mongoose.model('Participant', participantSchema);

/**
 * Functions
 *
 * Validate data provided by client
 */
function validateParticipant (participant) {
  const schema = {
    userId: Joi.objectId().required(),
    roomId: Joi.objectId().required()
  };
  return Joi.validate(participant, schema);
}

/**
 * Exports
 */
module.exports = {
  Participant: Participant,
  joiValidate: validateParticipant
};
