/**
 * Dependencies
 */
const jwt = require('jsonwebtoken');
const config = require('config');

/**
 * Validate an JWT token sent to server
 * 
 * A route has to explicitly state that
 * this middleware has to be used
 */
module.exports = function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided');

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token');
    }
}