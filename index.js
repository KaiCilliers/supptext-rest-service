/**
 * Dependencies
 */
const express = require('express');

/**
 * Setup
 */
const app = express();
const port = process.env.port || 3004;

/**
 * GET
 */
app.get('/', (req, res, next) => {
    console.log('get');
    res.send('get');
});
app.get('/api/data', (req, res, next) => {
    console.log([1,2,3]);
    res.send([1,2,3]);
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

/**
 * Listener
 */
app.listen(port, () => console.log(`Listening on port ${port}...`));