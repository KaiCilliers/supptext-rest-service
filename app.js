'use strcit';
/**
 * Dependencies
 * TODO
 * Check that your file size is at most between 300 to 500 lines of code, if not break into smaller files
 * Implement proper code comments
 * make a server that is shared among all test files :)
 * JSDoc and swagger for documentation
 * assign transactionId to each log statement
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
  require('./src/startup/displayConfigValues')();
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
