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
    app.use(morgan('tiny'));
}