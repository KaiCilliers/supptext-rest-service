/**
 * Dependencies
 */
const express = require('express');
const morgan = require('morgan');

/**
 * Setup Middleware
 */
module.exports = function(app) {
    app.use(express.json());
    if(app.get('env') === 'development') {
        app.use(morgan('tiny'));
        console.log('Morgan enabled...');
    }
}