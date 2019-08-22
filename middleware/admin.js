/**
 * Specific routes need this validation
 * to ensure only admin access.
 * 
 * A route has to explicitly state that
 * this middleware has to be used
 */
module.exports = function (req, res, next) {
    if (!req.user.isAdmin) return res.status(403).send('Access denied');
        next();
}