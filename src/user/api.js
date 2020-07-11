/**
 * Dependencies
 */
const express = require('express');
const { User, joiValidate } = require('./model');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth/auth');
const admin = require('../middleware/admin');
const validateBody = require('../middleware/validate');
const debug = require('debug')('supptext:api_user');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const router = express.Router();

/**
 * GET
 */
router.get('/', [auth, admin], async (req, res) => {
  try {
    debug('GET / user - Fetching all users...');
    const users = await User.find();
    res.send(users);
  } catch (err) {
    debug(err);
  }
});
router.get('/me', auth, async (req, res) => {
  try {
    debug('GET / logged in user - Searching for user by id...');
    const user = await User.findById(req.user._id);
    res.send(user);
  } catch (err) {
    debug(err);
    res.status(500).send(`Unkown error took place + ${err}`);
  }
});

/**
 * POST
 */
router.post('/', validateBody(joiValidate), async (req, res) => {
  try {
    debug('POST / user - Searching for existing registered phone number...');
    let user = await User.findOne({ phone: req.body.phone });
    if (user) return res.status(400).send('User already registered with provided phone number.');

    debug('Creating new user...');
    user = new User(
      _.pick(req.body, [
        'first_name', 'last_name', 'phone', 'password', 'status'
      ])
    );

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    debug('Saving user...');
    await user.save();

    debug('Generating authentication token...');
    const token = user.generateAuthToken();
    res.status(201).header('x-auth-token', token).send(
      _.pick(user, ['_id', 'first_name', 'last_name', 'phone', 'status'])
    );
  } catch (err) {
    debug.log(err);
    res.status(500).send(`Unkown error took place + ${err}`);
  }
});

/**
 * PATCH
 *
 * TODO update to only be able to edit own data
 * LMAO you never saved the updated user to the DB!
 */
router.patch('/:id', [auth, validateObjectId, validateBody(joiValidate)], async (req, res) => {
  try {
    debug('PATCH /:id user - Searching for user by id...');
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User with provided ID not found');

    user = {
      first_name: req.body.first_name ? req.body.first_name : user.first_name,
      last_name: req.body.last_name ? req.body.last_name : user.last_name,
      phone: user.phone,
      status: req.body.status ? req.body.status : user.status
    };

    debug('Saving user...');
    res.send(user);
  } catch (err) {
    debug(err);
    res.status(500).send(`Unkown error took place + ${err}`);
  }
});

/**
 * DELETE
 */
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  try {
    debug('DELETE /:id user - Searching for user by id...Deleting if found...');
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).send('User with provided ID not found');
    res.send(user);
  } catch (err) {
    debug(err);
    res.status(500).send(`Unkown error took place + ${err}`);
  }
});

/**
 * Exports
 */
module.exports = router;
