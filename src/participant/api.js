/**
 * Dependencies
 */
const express = require('express');
const { Participant, joiValidate } = require('./model');
const { Room } = require('../room/model');
const { User } = require('../user/model');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth/auth');
const validateBody = require('../middleware/validate');
const debug = require('debug')('supptext:routes_participants');
const router = express.Router();

/**
 * GET
 */
router.get('/', auth, async (req, res) => {
  try {
    debug('GET / participants - Fetching participants...');
    const participants = await Participant.find();
    res.send(participants);
  } catch (err) {
    debug(err);
    res.status(500).send(`Unkown error took place + ${err}`);
  }
});
router.get('/:id', [auth, validateObjectId], async (req, res) => {
  try {
    debug('GET /:id participant - Searching for participant by id...');
    const participant = await Participant.findById(req.params.id);
    if (!participant) return res.status(404).send('Participant with provided ID not found');
    res.send(participant);
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
    debug('POST / participant - Validating request body...');
    if (!req.body.userId) return res.status(400).send('No user id was provided');
    if (!req.body.roomId) return res.status(400).send('No room id was provided');

    debug('Fetching room and user by id...');
    const room = await Room.findById(req.body.roomId);
    const user = await User.findById(req.body.userId);

    if (!room || !user) return res.status(400).send('Provided IDs are not valid user ID or room ID');

    debug('Creating new participant...');
    const participant = new Participant({
      room: {
        _id: room._id,
        private: room.private,
        last_message: room.last_message
      },
      user: {
        _id: user._id,
        first_name: user.first_name,
        phone: user.phone
      },
      admin: false,
      creator: false
    });
    await participant.save();

    res.status(201).send(participant);
  } catch (err) {
    debug(err);
    res.status(500).send(`Unkown error took place + ${err}`);
  }
});

/**
 * DELETE
 *
 * TODO
 * dont send _ids via uri...
 */
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
  try {
    debug('DELETE /:id participant - Finding participant by id...Deleting if found...');
    const participant = await Participant.findByIdAndRemove(req.params.id);
    if (!participant) return res.status(404).send('Participant with provided ID not found');
    res.send(participant);
  } catch (err) {
    debug(err);
    res.status(500).send(`Unkown error took place + ${err}`);
  }
});

/**
 * Exports
 */
module.exports = router;
