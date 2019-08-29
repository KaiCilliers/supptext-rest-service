/**
 * Dependencies
 */
const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const {User} = require('../models/user');
const validateBody = require('../middleware/validate');
const debug = require('debug')('supptext:auth');

/**
 * POST
 * 
 * Logging user in logic
 * User has to be logged out on the client, because
 * the authentication token should not be stored in
 * the database.
 */
router.post('/', validateBody(validateLogin), async (req, res) => {
    let user = await User.findOne({ phone: req.body.phone });
    if(!user) return res.status(404).send('Invalid login.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid credentials');

    const token = user.generateAuthToken();
    debug(token);
    res.send(token);
});
// create user and check in postman what token is sent back when you auth routejksadiopsioadnh
/**
 * Functions
 * 
 * Validate data provided by client
 */
function validateLogin(req) {
    const schema = {
        phone: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(req, schema);
}

/**
 * Exports
 */
module.exports = router;