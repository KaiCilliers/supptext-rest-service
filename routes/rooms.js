/**
 * Dependencies
 */
const express = require('express');
const { Room, joiValidate } = require('../models/room');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const validateBody = require('../middleware/validate');
const debug = require('debug')('supptext:routes_rooms');
const router = express.Router();

/**
 * GET
 */
router.get('/', auth, async (req, res) => {
    const rooms = await Room.find();
    res.status(200).send(rooms);
});
router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const room = await Room.findById(req.params.id);
    if(!room) return res.status(404).send('Room with provided ID not found');
    res.status(200).send(room);
});

/**
 * POST
 */
router.post('/', [auth, validateBody(joiValidate)], async (req, res) => {
    const room = new Room({
        private: req.body.private
    });
    await room.save();
    res.status(201).send(room);
});

/**
 * PUT
 */
router.put('/:id', [auth, validateObjectId, validateBody(joiValidate)], async (req, res) => {
    const room = await Room.findById(req.params.id);
    if(!room) return res.status(404).send('Room with provided ID not found');

    room.private = req.body.private;
    room.save();

    res.status(200).send(room);
});

/**
 * DELETE
 */
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const room = await Room.findByIdAndRemove(req.params.id);
    if(!room) return res.status(404).send('Room with provided ID not found');
    res.send(room);
});

/**
 * Exports
 */
module.exports = router;