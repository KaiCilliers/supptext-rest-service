/**
 * Dependencies
 */
const mongoose = require('mongoose');

/**
 * Validate an ObjectId
 * 
 * Checks incoming request's object id
 * to ensure it is valid.
 * 
 * A route has to explicitly state that
 * this middleware has to be used
 */
module.exports = function(req, res, next) {
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send('Invalid ID');
    next();
}