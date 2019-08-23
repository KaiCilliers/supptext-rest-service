/**
 * Dependencies
 */
const express = require('express');
const { Participant, joiValidate } = require('../models/participant');
const { Room } = require('../models/room');
const { User } = require('../models/user');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const validateBody = require('../middleware/validate');
const debug = require('debug')('supptext:routes_participants');
const router = express.Router();

/**
 * GET
 */
router.get('/', auth, async (req, res) => {
    const participants = await Participant.find();
    res.send(participants);
});
router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const participant = await Participant.findById(req.params.id);
    if(!participant) return res.status(404).send('Participant with provided ID not found');
    res.send(participant);
});

/**
 * POST
 */
router.post('/', auth, async (req, res) => {
    if(!req.body.userId) return res.status(400).send('No user id was provided');
    if(!req.body.roomId) return res.status(400).send('No room id was provided');
    
    const room = await Room.findById(req.body.roomId);
    const user = await User.findById(req.body.userId);

    if(!room || !user) return res.status(400).send('Provided IDs are not valid user ID or room ID');
    
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
});

/**
 * DELETE
 */
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const participant = await Participant.findByIdAndRemove(req.params.id);
    if(!participant) return res.status(404).send('Participant with provided ID not found');
    res.send(participant);
});

/**
 * Exports
 */
module.exports = router;