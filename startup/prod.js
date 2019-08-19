/**
 * Dependencies
 */
// Protects application from basic web vulnerabilities with headers
const helmet = require('helmet');
// Compresses http response sent to client
const compression = require('compression')

/**
 * Exports
 */
module.exports = function(app) {
    app.use(helmet());
    app.use(compression());
}