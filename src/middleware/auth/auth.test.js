/**
 * Dependencies
 */
const request = require('supertest');
const auth = require('./auth');
const mongoose = require('mongoose');
const { Room } = require('../../room/room');
const { User } = require('../../user/user');

/**
 * Globals
 */
let server;

/**
 * Test Suite
 */
describe('auth middleware unit', () => {
  it('should populate req.user with the payload of a valid JWT', () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    };
    const token = new User(user).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token)
    };
    const res = {};
    const next = jest.fn();

    auth(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user).toMatchObject(user);
  });
});

describe('auth middleware integration', () => {
  /**
     * Locals
     */
  let token;

  /**
     * Setup & Cleanup
     */
  beforeEach(() => {
    server = require('../../../app');
    token = new User().generateAuthToken();
  });
  afterEach(async () => {
    await Room.deleteMany({});
    await server.close();
  });

  /**
     * Main Body for happy path
     */
  const exec = async () => {
    return await request(server)
      .post('/api/rooms')
      .set('x-auth-token', token)
      .send({ private: true });
  };

  /**
     * TESTS
     */
  it('should return 401 if no token is provided', async () => {
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);
  });
  it('should return 400 if token is invalid', async () => {
    token = 'a';
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it('should return 201 if token is valid', async () => {
    const res = await exec();
    expect(res.status).toBe(201);
  });
});
