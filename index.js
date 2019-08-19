/**
 * Dependencies
 */
const express = require('express');

const app = express();

app.get('/', (req, res, next) => {
    console.log('get');
    res.send('get');
});
app.get('/api/data', (req, res, next) => {
    console.log([1,2,3]);
    res.send([1,2,3]);
});

app.post('/', (req, res, next) => {
    console.log('post');
    res.send('post');
});

app.put('/', (req, res, next) => {
    console.log('put');
    res.send('put');
});

app.delete('/', (req, res, next) => {
    console.log('delete');
    res.send('delete');
});

/**
 * Listener
 */
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));