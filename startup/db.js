/**
 * Dependencies
 */
const config = require('config');
const debug = require('debug')('supptext:db');
const mysql = require('mysql');

/**
 * Export db object seperately
 * to allow calling queries on it
 */
let db = mysql.createConnection(config.get('db'));

/**
 * Start Database connection
 */
module.exports = {
    connect: function () {
        db.connect((err) => {
            // TODO this error catch needs to be replaced by global express catch later
            if(err) {
                debug('Database connection error: ' + err.stack);
                return;
            }
            debug('Database connection successfull with id: ' + db.threadId)
        })
    },
    db: db
  };