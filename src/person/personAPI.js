'use strcit';
/**
 * Dependencies
 */
const express = require('express');
const { Person, joiValidate } = require('./person');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth/auth');
const validateBody = require('../middleware/validate');
const debug = require('debug')('supptext:api_v2_person');
const _ = require('lodash');
const router = express.Router();
const tryCatch = require('../middleware/asyncErrorWrapper');

/** GET */

/**
 * Fetch all registered phone numbers as list
 */
router.get('/phones', auth, tryCatch(async (req, res) => {
  debug('GET / person - Fetching all registered numbers...');
  const result = await Person.find();
  const phoneList = result.map(person => person.phone);
  res.send(phoneList);
}));

/** POST */

/**
 * Create a new Person
 */
router.post('/', validateBody(joiValidate), tryCatch(async (req, res) => {
  debug('POST / person - Searching for existing registered phone number...');
  let person = await Person.findOne({ phone: req.body.phone });
  if (person) return res.status(400).send('Person already registered with provided phone number.');

  debug('Creating new person...');
  person = new Person(
    _.pick(req.body, [
      'display_name', 'phone'
    ])
  );

  debug('Saving person...');
  await person.save();

  debug('Generating authentication token...');
  const token = person.generateAuthToken();
  res.status(201).header('x-auth-token', token).send(
    _.pick(person, [
      '_id', 'display_name', 'phone', 'status',
      'active_conversations', 'favourite_conversations',
      'favourite_messages', 'favourite_persons',
      'blocked_persons', 'isAdmin'
    ])
  );
}));

/** PATCH */

/**
 * Update specific personal person details
 */
router.patch('/personal/:id', [auth, validateObjectId, validateBody(joiValidate)], tryCatch(async (req, res) => {
  debug('PATCH /:id person - Searching for person by id...');
  const person = await Person.findByIdAndUpdate(
    req.params.id, {
      display_name: req.body.display_name,
      status: req.body.status
    }, {
      new: true
    });

  if (!person) return res.status(404).send('Person with provided ID not found');

  debug('Updating person...');
  await person.save();

  res.send(person);
}));

/**
 * TODO Update one of the lists associated with a person
 */

/** DEBUG */

/**
 * Fetch all existing Person records
 */
router.get('/debug/all', tryCatch(async (req, res) => {
  debug('DEBUG GET / person - Fetching all registered numbers...');
  const persons = await Person.find();
  res.send(persons);
}));
/**
* DELETE a person
*/
router.delete('/debug/:id', validateObjectId, tryCatch(async (req, res) => {
  debug('DEBUG DELETE /:id person - Searching for person by id...Deleting if found...');
  const person = await Person.findByIdAndRemove(req.params.id);
  if (!person) return res.status(404).send('Person with provided ID not found');
  res.send(person);
}));
/**
 * Exports
 */
module.exports = router;
