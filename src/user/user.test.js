'use strcit';
/**
 * Dependencies
 */
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('./user');

/**
 * Test Suite
 */
describe('user.generateAuthToken', () => {
  /**
     * Tests
     */
  it('should return a valid JWT', () => {
    const payload = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    expect(decoded).toMatchObject(payload);
  });
});
