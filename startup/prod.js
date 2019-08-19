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
    if(app.get('env') === 'production') {
        app.use(helmet());
        app.use(compression());
        console.log('Helmet enabled...');
        console.log('Compression enabled...');
    }
}