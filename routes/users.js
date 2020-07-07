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
const bcrypt = require('bcrypt');
const _ = require('lodash');
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
    let user = await User.findOne({ phone: req.body.phone });
    if (user) return res.status(400).send('User already registered with provided phone number.');

    user = new User(
        _.pick(req.body, [
            'first_name', 'last_name', 'phone', 'password', 'status'
        ])
    );

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    
    const token = user.generateAuthToken();
    res.status(201).header('x-auth-token', token).send(
        _.pick(user, ['_id', 'first_name', 'last_name', 'phone', 'status'])
    );
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