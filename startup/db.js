/**
 * Dependencies
 */
const mongoose = require('mongoose');
const debug = require('debug')('supptext:db');
const config = require('config');

/**
 * Start Database Connection
 */
module.exports = function() {
    const db = config.get('db');
    mongoose.connect(db, { useNewUrlParser: true })
        .then(() => debug(`Connected to ${db}...`));
}