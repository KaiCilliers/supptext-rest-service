/**
 * Dependencies
 */
const mongoose = require('mongoose');
const debug = require('debug')('supptext:middleware_validate-object-id');

/**
 * Validate an ObjectId
 *
 * Checks incoming request's object id
 * to ensure it is valid.
 *
 * A route has to explicitly state that
 * this middleware has to be used
 */
module.exports = function (req, res, next) {
  debug('Checking if received ID is a valid object ID...');
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) { return res.status(404).send('Invalid ID'); }
  next();
};
