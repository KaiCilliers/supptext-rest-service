/**
 * Dependencies
 */
const config = require('config');
const debug = require('debug')('supptext:config-values');

module.exports = function() {
    debug('Application Name: ' + config.get('name'));
    debug('Database: ' + config.get('db.database'));
    debug('Database Host: ' + config.get('db.host'));
    debug('Datbase User: ' + config.get('db.user'));
    debug('Datase Password: ' + config.get('db.password'));
}