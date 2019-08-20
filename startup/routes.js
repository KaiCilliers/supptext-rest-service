/**
 * Dependencies
 */
const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('supptext:routes');

/**
 * Setup Middleware
 */
module.exports = function(app) {
    app.use(express.json());
    if(app.get('env') === 'development') {
        app.use(morgan('tiny'));
        debug('Morgan enabled...');
    }
}