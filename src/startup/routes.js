/**
 * Dependencies
 */
const express = require('express');
const morgan = require('morgan');
const winston = require('../../config/winston');
const error = require('../middleware/error');
const debug = require('debug')('supptext:routes');
const users = require('../user/api');
const rooms = require('../room/api');
const participants = require('../participant/api');
const messages = require('../message/api');
const auth = require('../login/login');

/**
 * Setup Middleware
 */
module.exports = function(app) {
    app.use(express.json());
    if(app.get('env') === 'development') {
        app.use(morgan('combined', { stream: winston.stream }));
        debug('Morgan enabled...');
    }
    app.use('/api/users', users);
    app.use('/api/rooms', rooms);
    app.use('/api/participants', participants);
    app.use('/api/messages', messages);
    app.use('/api/auth', auth);
    app.use(error);
}