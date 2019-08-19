/**
 * Dependencies
 */
const express = require('express');
const debug = require('debug')('supptext:users');
const router = express.Router();

/**
 * GET
 */
router.get('/', (req, res, next) => {
    console.log('get');
    res.send('get');
});
router.get('/:id', (req, res) => {
    con.query(`SELECT * FROM users LIMIT ${req.params.id}`, (err, rows, fields) => {
        if (err) throw err
        debug(rows);
        res.send(rows);
    });
});

/**
 * POST
 */
router.post('/', (req, res, next) => {
    console.log('post');
    res.send('post');
});

/**
 * PUT
 */
router.put('/', (req, res, next) => {
    console.log('put');
    res.send('put');
});

/**
 * DELETE
 */
router.delete('/', (req, res, next) => {
    console.log('delete');
    res.send('delete');
});

/**
 * Exports
 */
module.exports = router;