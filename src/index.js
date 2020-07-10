/**
 * Dependencies
 * TODO
 * 
 * Clean up the config section and make it more clean
 * Restructure the folders
 * Get your env variables sorted
 * 
 * Check that your file size is at most between 300 to 500 lines of code, if not break into smaller files
 * Implement proper code comments
 * Proper error handling? Leave for later?
 * reconfigure winston logs
 * 
 */
const express = require('express');
const debug = require('debug')('supptext:startup');
const logger = require('../config/winston');

/**
 * Throw async errors synchronously
 */
process.on('unhandledRejection', (ex) => {
    logger.error(new Error(ex));
    throw ex;
});


/**
 * Setup
 */
const app = express();
const PORT = process.env.PORT || 3004;

/**
 * Startup Code
 */
require('./startup/display-config-values')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

/**
 * Listener
 */
const server = app.listen(PORT, () => debug(`Listening on port ${PORT}...`));

/**
 * Exports
 */
module.exports = server;