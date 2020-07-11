/**
 * Dependencies
 */
const jwt = require('jsonwebtoken');
const config = require('config');
const debug = require('debug')('supptext:middleware_auth');

/**
 * Validate an JWT token sent to server
 *
 * A route has to explicitly state that
 * this middleware has to be used
 */
module.exports = function auth (req, res, next) {
  debug('Verifying existance of authorization token...');
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided');

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    next();
  } catch (err) {
    debug(err);
    res.status(400).send('Invalid token');
  }
};
