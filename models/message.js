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
            created_at: {
                type: Date,
                required: true,
                default: Date.now
            },
            private: {
                type: Boolean,
                required: true
            },
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
messageSchema.statics.lookup = function(userId, roomId) {
    return this.findOne({
        'user._id': userId,
        'room._id': roomId
    });
}
const Message = mongoose.model('Message', messageSchema);

/**
 * Functions
 * 
 * Validate data provided by client
 */
function validateMessage(message) {
    const schema = {
        userId: Joi.objectId().required(),
        roomId: Joi.objectId().required(),
        content: Joi.string().min(1).max(255).required()
    }
    return Joi.validate(rental, schema);
}

/**
 * Exports
 */
module.exports = {
    Message: Message,
    joiValidate: validateMessage
}