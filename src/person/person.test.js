'use strict';

/**
 * Dependencies
 */
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const { Person } = require('./person');
const debug = require('debug')('supptext:test_person');

/**
 * Test Suite
 */
describe('person.generateAuthToken', () => {
  /**
    * Tests
    */
  it('should return a valid JWT', () => {
    const payload = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    };
    const person = new Person(payload);
    debug(`Generate id: ${person._id}`);

    const token = person.generateAuthToken();
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

    debug(`Decoded id: ${decoded._id}`);
    expect(decoded).toMatchObject(payload);
  });
});
