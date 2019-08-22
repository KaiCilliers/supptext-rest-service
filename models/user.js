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
        maxlength: 255,
        default: 'Supp! Want to chat?'
    },
    is_dev: {
        type: Boolean,
        default: true
    }
});
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, is_dev: this.is_dev }, config.get('jwtPrivateKey'));
    return token;
}
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
module.exports = {
    User: User,
    joiValidate: validateUser
}