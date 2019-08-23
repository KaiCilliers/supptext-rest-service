/**
 * Dependencies
 */
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

/**
 * Schema and Model
 */
const messageSchema = new mongoose.Schema({
    room: {
        type: new mongoose.Schema({
            last_message: {
                type: Date
            }
        }),
        required: true
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
        }),
        required: true
    },
    content: {
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
    }
});
const Message = mongoose.model('Message', messageSchema);

/**
 * Functions
 * 
 * Validate data provided by client
 */
function validateMessage(message) {
    const schema = {
        content: Joi.string().min(1).max(255).required()
    }
    return Joi.validate(message, schema);
}

/**
 * Exports
 */
module.exports = {
    Message: Message,
    joiValidate: validateMessage
}