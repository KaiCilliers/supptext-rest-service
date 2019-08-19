/**
 * Dependencies
 */
const express = require('express');
const config = require('config');
const debug = require('debug')('supptext:startup');
const mysql = require('mysql');

/**
 * Setup
 */
const app = express();
const port = process.env.port || 3004;
const con = mysql.createConnection(config.get('db'));

/**
 * Startup Code
 */
require('./startup/routes')(app);
require('./startup/prod')(app);
con.connect((err) => {
    if(err) {
        debug('Database connection error: ' + err.stack);
        return;
    }
    debug('Database connection successfull with id: ' + con.threadId)
});

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
    con.query(`SELECT * FROM users LIMIT ${req.params.id}`, (err, rows, fields) => {
        if (err) throw err
        debug(rows);
        res.send(rows);
    });
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