/**
 * Dependencies
 */
const express = require('express');

/**
 * Setup Middleware
 */
module.exports = function(app) {
    app.use(express.json());
}