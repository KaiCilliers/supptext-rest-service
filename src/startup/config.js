/**
 * Dependncies
 */
const config = require('config');
const debug = require('debug')('supptext:config_env');

/**
 * Configuration Settings
 * Environment Varaibles Setup
 */
module.exports = function () {
  debug('Confirming required environmental variables have been set...');
  if (!config.get('jwtPrivateKey')) {
    /**
         * Let global errorhandler handle error
         * Throw Error object and not String, because
         * you want the stacktrace
         */
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined');
  }
}
;
