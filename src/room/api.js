/**
 * Dependencies
 */
const express = require('express');
const { Room, joiValidate } = require('./model');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth/auth');
const validateBody = require('../middleware/validate');
const debug = require('debug')('supptext:api_room');
const router = express.Router();
const tryCatch = require('../middleware//asyncErrorWrapper');

/**
 * GET
 *
 * TODO
 * admin should only be able to call this
 * also add more data to body like a room name
 */
router.get('/', auth, tryCatch(async (req, res) => {
  debug('GET / all rooms - Fetching rooms...');
  const rooms = await Room.find();
  res.status(200).send(rooms);
}));
router.get('/:id', [auth, validateObjectId], tryCatch(async (req, res) => {
  debug('GET /:id room - Searching for a room by id...');
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).send('Room with provided ID not found');
  res.status(200).send(room);
}));

/**
 * POST
 */
router.post('/', [auth, validateBody(joiValidate)], tryCatch(async (req, res) => {
  debug('POST / room - Creating a new room...');
  const room = new Room({
    private: req.body.private
  });
  await room.save();
  res.status(201).send(room);
}));

/**
 * PUT
 *
 * TODO
 * put is used to replace object, if you just modify use patch
 * only users that are members of the group should be able to edit if they have rights to do so
 */
router.put('/:id', [auth, validateObjectId, validateBody(joiValidate)], tryCatch(async (req, res) => {
  debug('PUT /:id room - Searching for room by id....');
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).send('Room with provided ID not found');

  debug('Saving updated room...');
  room.private = req.body.private;
  room.save();

  res.status(200).send(room);
}));

/**
 * DELETE
 */
router.delete('/:id', [auth, validateObjectId], tryCatch(async (req, res) => {
  debug('DELETE /:id room - Searching for room by id...Removing if found...');
  const room = await Room.findByIdAndRemove(req.params.id);
  if (!room) return res.status(404).send('Room with provided ID not found');
  res.send(room);
}));

/**
 * Exports
 */
module.exports = router;
