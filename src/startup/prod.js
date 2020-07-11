/**
 * Dependencies
 */
const helmet = require('helmet');
const compression = require('compression');
const debug = require('debug')('supptext:prod');

/**
 * Exports
 */
module.exports = function (app) {
  if (app.get('env') === 'production') {
    app.use(helmet());
    app.use(compression());
    debug('Helmet enabled...');
    debug('Compression enabled...');
  }
};
