/**
 * Dependencies
 */
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

/**
 * Models with Schemas
 */
const roomSchema = new mongoose.Schema({
    created_at: {
        type: Date,
        default: Date.now
    },
    private: {
        type: Boolean,
        required: true
    },
    last_message: {
        type: Date,
        default: null
    }
});
const Room = mongoose.model('Room', roomSchema);

/**
 * Functions
 * 
 * Validate data provided by client
 */
function validateRoom(room) {
    const schema = {
        created_at: Joi.date(),
        private: Joi.boolean().required(),
        last_message: Joi.date()
    }
    return Joi.validate(room, schema);
}

/**
 * Exports
 */
module.exports = {
    Room: Room,
    joiValidate: validateRoom
}