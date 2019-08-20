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
participantSchema.statics.lookup = function(userId, roomId) {
    return this.findOne({
        'user._id': userId,
        'room._id': roomId
    });
}
participantSchema.methods.return = function(admin, creator) {
    this.admin = admin;
    this.creator = creator;
}
const Participant = mongoose.model('Participant', participantSchema);

/**
 * Functions
 * 
 * Validate data provided by client
 */
function validateParticipant(participant) {
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
}