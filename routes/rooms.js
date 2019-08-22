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
router.get('/', async (req, res) => {
    const rooms = await Room.find();
    res.send(rooms);
});

/**
 * Exports
 */
module.exports = router;