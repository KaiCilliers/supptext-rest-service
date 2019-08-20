/**
 * Dependencies
 */
const config = require('config');
const debug = require('debug')('supptext:config-values');

module.exports = function() {
    debug('Application Name: ' + config.get('name'));
}