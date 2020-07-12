'use strcit';
/**
 * Dependencies
 */
const debug = require('debug')('supptext:middleware_admin');

/**
 * Specific routes need this validation
 * to ensure only admin access.
 *
 * A route has to explicitly state that
 * this middleware has to be used
 */
module.exports = function (req, res, next) {
  debug('Verifying that requesting user has admin rights...');
  if (!req.user.isAdmin) return res.status(403).send('Access denied');
  next();
};
