/**
 * Dependncies
 */
const config = require('config');

/**
 * Configuration Settings
 * Environment Varaibles Setup
 */
module.exports = function() {
    if (!config.get('jwtPrivateKey')) {
        /**
         * Let global errorhandler handle error
         * Throw Error object and not String, because
         * you want the stacktrace
         */
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined');
    }
}