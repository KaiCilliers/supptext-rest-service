/**
 * Dependencies
 */
const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('supptext:routes');
const users = require('../routes/users');
const rooms = require('../routes/rooms');
const participants = require('../routes/participants');
const messages = require('../routes/messages');
const auth = require('../routes/auth');

/**
 * Setup Middleware
 */
module.exports = function(app) {
    app.use(express.json());
    if(app.get('env') === 'development') {
        app.use(morgan('tiny'));
        debug('Morgan enabled...');
    }
    app.use('/api/users', users);
    app.use('/api/rooms', rooms);
    app.use('/api/participants', participants);
    app.use('/api/messages', messages);
    app.use('/api/auth', auth);
}