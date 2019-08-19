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
require('./startup/prod')(app);

// Configuration (change NODE_ENV to get diff results)
debug('Application Name: ' + config.get('name'));
debug('Mail Server: ' + config.get('mail.host'));
debug('Mail Password: ' + config.get('mail.password'));

{
    /**
 * GET
 */
app.get('/', (req, res, next) => {
    console.log('get');
    res.send('get');
});
app.get('/api/data', (req, res) => {
    console.log([1,2,3]);
    res.send([1,2,3]);
});
app.get('/api/data/:id', (req, res) => {
    res.send(req.params.id);
});

/**
 * POST
 */
app.post('/', (req, res, next) => {
    console.log('post');
    res.send('post');
});

/**
 * PUT
 */
app.put('/', (req, res, next) => {
    console.log('put');
    res.send('put');
});

/**
 * DELETE
 */
app.delete('/', (req, res, next) => {
    console.log('delete');
    res.send('delete');
});
}

/**
 * Listener
 */
app.listen(port, () => debug(`Listening on port ${port}...`));