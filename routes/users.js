/**
 * Dependencies
 */
const express = require('express');
const { User, joiValidate } = require('../models/user');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateBody = require('../middleware/validate');
const debug = require('debug')('supptext:routes_users');
const router = express.Router();

/**
 * GET
 */
router.get('/', [auth, admin], async (req, res) => {
    const users = await User.find();
    res.send(users);
});
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id);
    res.send(user);
});

/**
 * POST
 */
router.post('/', validateBody(joiValidate), async (req, res) => {
    const phoneCheck = User.findOne({ phone: req.body.phone });

    if(phoneCheck.length > 0) return res.status(400).send('User already exists with provided phone number');

    const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        status: req.body.status
    });
    
    await user.save();
    
    res.status(201).send(user);
});

/**
 * PATCH
 */
router.patch('/:id', [auth, validateObjectId, validateBody(joiValidate)], async (req, res) => {
    let user = await User.findById(req.params.id);
    if(!user) return res.status(404).send('User with provided ID not found');

    user = {
        first_name: req.body.first_name ? req.body.first_name : user.first_name,
        last_name: req.body.last_name ? req.body.last_name : user.last_name,
        phone: user.phone,
        status: req.body.status ? req.body.status : user.status
    };

    res.send(user);
});

/**
 * DELETE
 */
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if(!user) return res.status(404).send('User with provided ID not found');
    res.send(user);
});

/**
 * Exports
 */
module.exports = router;