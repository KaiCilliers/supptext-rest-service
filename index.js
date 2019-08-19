/**
 * Dependencies
 */
const express = require('express');
const config = require('config');

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
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));

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
app.listen(port, () => console.log(`Listening on port ${port}...`));