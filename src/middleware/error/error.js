/**
 * Dependencies
 *
 * TODO run all tests without restarting app :/
 */
const logger = require('../../../config/winston');

/**
 * Handle errors within Express context
 */
module.exports = function (err, req, res, next) {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, { meta: err });
  res.status(500).send('[Router Handler] Something failed');
  next();
};
