'use strcit';
/**
 * Dependencies
 */
const express = require('express');
const { Conversation, joiValidate2 } = require('./conversation');
const auth = require('../middleware/auth/auth');
const validateBody = require('../middleware/validate');
const debug = require('debug')('supptext:api_v2_conversation');
const router = express.Router();
const tryCatch = require('../middleware//asyncErrorWrapper');

/** GET */

/**
 * Fetch all conversations
 */
router.get('/', tryCatch(async (req, res) => {
  debug('DEBUG GET / all conversations - Fetching conversations...');
  const conversations = await Conversation.find();
  res.status(200).send(conversations);
}));

/** POST */

/**
  * Create a new group conversation
  */
router.post('/group', [auth, validateBody(joiValidate2)], tryCatch(async (req, res) => {
  debug('POST / conversation - Creating a new group conversation...');
  const conversation = new Conversation({
    name: req.body.name,
    description: req.body.description,
    creator: req.body.creator
  });
  await conversation.save();
  res.status(201).send(conversation);
}));

/**
 * Exports
 */
module.exports = router;
