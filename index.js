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
app.get('/api/data', (req, res) => {
    console.log([1,2,3]);
    res.send([1,2,3]);
});
app.get('/api/data/:id', (req, res) => {
    res.send(req.params.id);
});
// http://localhost:3004/api/data/1996/6/9?sortBy="asc"
app.get('/api/data/:year/:month/:day', (req, res) => {
    console.log(req.query);
    res.send(req.params);
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