/**
 * Dependencies
 */
const Joi = require('@hapi/joi');
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
        maxlength: 255
    }
});
const User = mongoose.model('User', userSchema);

/**
 * Functions
 * 
 * Validate data provided by client
 */
function validateUser(user) {
    const schema = {
        first_name: Joi.string().min(2).max(50).required(),
        last_name: Joi.string().min(3).max(50).required(),
        phone: Joi.string().min(10).max(15).required(),
        status: Joi.string().min(1).max(255)
    };
    return Joi.validate(user, schema);
}

/**
 * Exports
 */
module.exports.User = User;
module.exports.joiValidate = validateUser;