/**
 * Dependencies
 */
const config = require('config');
const debug = require('debug')('supptext:db');
const mysql = require('mysql');

/**
 * Start Database connection
 */
module.exports = function() {
    const db = mysql.createConnection(config.get('db'));
    db.connect((err) => {
        // TODO this error catch needs to be replaced by global express catch later
        if(err) {
            debug('Database connection error: ' + err.stack);
            return;
        }
        debug('Database connection successfull with id: ' + db.threadId)
    });
}