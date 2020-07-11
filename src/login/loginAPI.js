/**
 * Dependencies
 */
const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const { User } = require('../user/user');
const validateBody = require('../middleware/validate');
const debug = require('debug')('supptext:api_login');
const tryCatch = require('../middleware/asyncErrorWrapper');

/**
 * POST
 *
 * Logging user in logic
 * User has to be logged out on the client, because
 * the authentication token should not be stored in
 * the database.
 *
 * TODO
 * send token as a header...
 */
router.post('/', validateBody(validateLogin), tryCatch(async (req, res) => {
  debug('Finding a user matching request...');
  const user = await User.findOne({ phone: req.body.phone });
  if (!user) return res.status(404).send('Invalid login.');

  debug('Checking if provided password is valid...');
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid credentials');

  debug('Generating user authentication token...');
  const token = user.generateAuthToken();

  res.send(token);
}));
// TODO create user and check in postman what token is sent back when you auth routejksadiopsioadnh
/**
 * Functions
 *
 * Validate data provided by client
 */
function validateLogin (req) {
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
