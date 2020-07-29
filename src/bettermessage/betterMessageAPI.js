'use strcit';
/**
 * Dependencies
 */
const express = require('express');
const { BetterMessage, joiValidate } = require('./betterMessage');
const validateBody = require('../middleware/validate');
const auth = require('../middleware/auth/auth');
const debug = require('debug')('supptext:api_v2_betterMessage');
const router = express.Router();
const tryCatch = require('../middleware/asyncErrorWrapper');

/** DEBUG */

/**
 * Fetch all messages
 */
router.get('/', tryCatch(async (req, res) => {
  debug('DEBUG GET / betterMessage all - Fetching all betterMessages...');
  const messages = await BetterMessage.find();
  res.send(messages);
}));

/** POST */

/**
 * Create a new message
 */
router.post('/', [auth, validateBody(joiValidate)], tryCatch(async (req, res) => {
  debug('POST / new betterMessage - Validating request body...');

  const betterMessage = new BetterMessage({
    conversation: req.body.conversation,
    author: req.body.author,
    body: req.body.body
  });

  /**
   * TODO extend save method with custom to save and find to return value from db
   * https://stackoverflow.com/questions/40321323/mongoose-modelsave-return-value
   */
  await betterMessage.save();

  /**
   * TODO add message _id to matching conversation
   */
  res.status(201).send(betterMessage);
}));

/**
 * Exports
 */
module.exports = router;
