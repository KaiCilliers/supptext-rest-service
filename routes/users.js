/**
 * Dependencies
 */
const express = require('express');
const debug = require('debug')('supptext:users');
const mysql = require('mysql');
const { db } = require('../startup/db');
const router = express.Router();

/**
 * GET
 */
router.get('/', (req, res, next) => {
    let selectTemplate = 'SELECT * FROM ??';
    let inserts = ['users'];
    let query = mysql.format(selectTemplate, inserts);
    const result = db.query(query, (err, response) => {
        if (err) return debug(`Select error: ${err}`);
        debug(response);
        res.send(response);
    });
});
router.get('/:id', (req, res) => {
    let selectTemplate = 'SELECT * FROM ?? WHERE user_id = ?';
    let inserts = ['users', req.params.id];
    let query = mysql.format(selectTemplate, inserts);
    const result = db.query(query, (err, response) => {
        if (err) return debug(`Select error: ${err}`);
        debug(response);
        res.send(response);
    });
});

/**
 * POST
 */
router.post('/', async (req, res) => {
    let insertTemplate = 'INSERT INTO ?? (??, ??, ??) VALUES (?, ?, ?)';
    let inserts = [
        'users',
        'first_name',
        'last_name',
        'phone',
        req.body.first_name,
        req.body.last_name,
        req.body.phone
    ];
    let query = mysql.format(insertTemplate, inserts);
    const result = await db.query(query, (err, response) => {
        if (err) return debug(`Insert error: ${err}`);
        debug(response.insertId);
        res.send(response);
    });
});

/**
 * PUT
 */
router.put('/status/:id', (req, res) => {
    let updateTemplate = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';
    let inserts = [
        'users',
        'status',
        req.body.status,
        'user_id',
        req.params.id
    ];
    let query = mysql.format(updateTemplate, inserts);
    const result = db.query(query, (err, response) => {
        if (err) return debug(`Update error: ${err}`);
        debug(response);
        res.send(response);
    });
});

/**
 * DELETE
 */
router.delete('/:id', (req, res, next) => {
    let deleteTemplate = 'DELETE FROM ?? WHERE ?? = ?';
    let inserts = [
        'users',
        'user_id',
        req.params.id
    ];
    let query = mysql.format(deleteTemplate, inserts);
    const result = db.query(query, (err, response) => {
        if (err) return debug(`Delete error: ${err}`);
        debug(response);
        res.send(response);
    });
});

/**
 * Exports
 */
module.exports = router;