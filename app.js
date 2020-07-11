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
 add use strict to all files

 Rename files
 user
 user-model
 user-api
 *
 */
const express = require('express');
const debug = require('debug')('supptext:startup');
const logger = require('./config/winston');

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
if (!app.get('env') === 'production') {
  require('./src/startup/display-config-values')();
}
require('./src/startup/routes')(app);
require('./src/startup/db')();
require('./src/startup/config')();
require('./src/startup/validation')();
require('./src/startup/prod')(app);

/**
 * Listener
 */
const server = app.listen(PORT, () => debug(`Listening on port ${PORT}...`));

/**
 * Exports
 */
module.exports = server;
