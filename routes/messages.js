/**
 * Dependencies
 */
const express = require('express');
const { Message, joiValidate } = require('../models/message');
const { Room } = require('../models/room');
const { User } = require('../models/user');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const validateBody = require('../middleware/validate');
const debug = require('debug')('supptext:routes_messages');
const router = express.Router();

/**
 * GET
 */
router.get('/', auth, async (req, res) => {
    const messages = await Message.find();
    res.send(messages);
});
router.get('/:id', [auth, validateObjectId], async (req, res) => {
    const message = await Message.findById(req.params.id);
    if(!message) return res.status(404).send('Message with provided ID not found');
    res.send(message);
});

/**
 * POST
 */
router.post('/', auth, async (req, res) => {
    if(!req.body.userId) return res.status(400).send('No user id was provided');
    if(!req.body.roomId) return res.status(400).send('No room id was provided');
    if(!req.body.content) return res.status(400).send('No message content was provided');
    
    const room = await Room.findById(req.body.roomId);
    const user = await User.findById(req.body.userId);

    if(!room || !user) return res.status(400).send('Provided IDs are not valid user ID or room ID');

    if(req.body.content.length < 1 || req.body.content.length > 255)
        return res.status(400).send('Invalid message content length');

    const message = new Message({
        room : {
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
});

/**
 * DELETE
 */
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const message = await Message.findByIdAndRemove(req.params.id);
    if(!message) return res.status(404).send('Message with provided ID not found');
    res.send(message);
});
/**
 * Exports
 */
module.exports = router;