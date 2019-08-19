/**
 * Dependencies
 */
const express = require('express');
const config = require('config');
const debug = require('debug')('supptext:startup');

/**
 * Setup
 */
const app = express();
const port = process.env.port || 3004;

/**
 * Startup Code
 */
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/prod')(app);

// Configuration (change NODE_ENV to get diff results)
debug('Application Name: ' + config.get('name'));
debug('Database: ' + config.get('db.database'));
debug('Database Host: ' + config.get('db.host'));
debug('Datbase User: ' + config.get('db.user'));
debug('Datase Password: ' + config.get('db.password'));

/**
 * Listener
 */
app.listen(port, () => debug(`Listening on port ${port}...`));