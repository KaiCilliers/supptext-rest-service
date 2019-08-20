/**
 * Dependencies
 */
const express = require('express');
const { User, joiValidate } = require('../models/user');
const router = express.Router();

/**
 * GET
 */
router.get('/', async (req, res) => {
    const users = await User.find().sort('first_name');
    res.send(users);
});
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).send('User with provided ID not found');
    res.send(user);
});

/**
 * POST
 */
router.post('/', async (req, res) => {
    const { error } = joiValidate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Using let because when saving, the ID will be sent to us and we want to reset genre with the ID attribute
    let user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        status: req.body.status
    });
    
    let = await user.save();

    res.send(user);
});

/**
 * PUT
 */
router.put('/:id', async (req, res) => {
    const { error } = joiValidate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const user = await User.findByIdAndUpdate(req.params.id, {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        status: req.body.status
    }, { new: true });

    if(!user) return res.status(404).send('User with provided ID not found');

    res.send(user);
});

/**
 * DELETE
 */
router.delete('/:id', async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if(!user) return res.status(404).send('User with provided ID not found');
    res.send(user);
});

/**
 * Exports
 */
module.exports = router;