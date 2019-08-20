/**
 * Dependencies
 */
const express = require('express');
const debug = require('debug')('supptext:startup');

/**
 * Setup
 */
const app = express();
const port = process.env.port || 3004;

/**
 * Startup Code
 */
require('./startup/display-config-values')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/prod')(app);

/**
 * Listener
 */
app.listen(port, () => debug(`Listening on port ${port}...`));