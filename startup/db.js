/**
 * Dependencies
 */
const config = require('config');
const debug = require('debug')('supptext:db');
const mysql = require('mysql');

/**
 * Rather create a pool
 * This is safer
 */
let pool = mysql.createPool(config.get('pool_db'));

/**
 * Start Database connection
 */
module.exports = {
    connect: function () {
        pool.getConnection((err, connection) => {
            // TODO this error catch needs to be replaced by global express catch later
            if (err) {
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    debug('Database connection was closed.')
                }
                if (err.code === 'ER_CON_COUNT_ERROR') {
                    debug('Database has too many connections.')
                }
                if (err.code === 'ECONNREFUSED') {
                    debug('Database connection was refused.')
                }
            }
            if (connection) connection.release()
            return
        })
    },
    db: pool
  };