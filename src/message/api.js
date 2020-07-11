/**
 * Dependencies
 */
const express = require('express');
const { Message, joiValidate } = require('./model');
const { Room } = require('../room/model');
const { User } = require('../user/model');
const validateObjectId = require('../middleware/validateObjectId');
const validateBody = require('../middleware/validate');
const auth = require('../middleware/auth/auth');
const debug = require('debug')('supptext:api_message');
const router = express.Router();

/**
 * GET
 */
router.get('/', auth, async (req, res) => {
  try {
    debug('GET/ message all - Fetching all messages...');
    const messages = await Message.find();
    res.send(messages);
  } catch (err) {
    debug(err);
    res.status(500).send(`Unkown error took place + ${err}`);
  }
});
router.get('/:id', [auth, validateObjectId], async (req, res) => {
  try {
    debug('GET/ message by id - Fetching message by id...');
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).send('Message with provided ID not found');
    res.send(message);
  } catch (err) {
    debug(err);
    res.status(500).send(`Unkown error took place + ${err}`);
  }
});

/**
 * POST
 */
router.post('/', [auth, validateBody(joiValidate)], async (req, res) => {
  try {
    debug('POST/ new message - Validating request body...');
    if (!req.body.userId) return res.status(400).send('No user id was provided');
    if (!req.body.roomId) return res.status(400).send('No room id was provided');
    if (!req.body.content) return res.status(400).send('No message content was provided');

    const room = await Room.findById(req.body.roomId);
    const user = await User.findById(req.body.userId);

    if (!room || !user) return res.status(400).send('Provided IDs are not valid user ID or room ID');

    if (req.body.content.length < 1 || req.body.content.length > 255) { return res.status(400).send('Invalid message content length'); }

    const message = new Message({
      room: {
        _id: room._id,
        last_message: room.last_message
      },
      user: {
        _id: user._id,
        first_name: user.first_name,
        phone: user.phone
      },
      content: req.body.content,
      sent: false,
      received: false
    });
    await message.save();

    res.status(201).send(message);
  } catch (err) {
    debug(err);
    res.status(500).send(`Unkown error took place + ${err}`);
  }
});

/**
 * DELETE
 *
 * TODO
 * users should only be able to delete their own messages
 */
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
  try {
    debug('DELETE/ message by id - Searching for message existance...');
    const message = await Message.findByIdAndRemove(req.params.id);
    if (!message) return res.status(404).send('Message with provided ID not found');
    res.send(message);
  } catch (err) {
    debug(err);
    res.status(500).send(`Unkown error took place + ${err}`);
  }
});
/**
 * Exports
 */
module.exports = router;
