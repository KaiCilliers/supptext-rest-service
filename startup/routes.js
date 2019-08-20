/**
 * Dependencies
 */
const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('supptext:routes');
const users = require('../routes/users');

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
}