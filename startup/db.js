/**
 * Dependencies
 */
const mongoose = require('mongoose');
const debug = require('debug')('supptext:db');
const config = require('config');

/**
 * Start Database Connection
 * 
 TODO
 consider using process.env.MONGODB_URI for connections
 */
module.exports = function() {
    const db = config.get('db');
    mongoose.connect(db, { useNewUrlParser: true })
        .then(() => debug(`Connected to ${db}...`));
}