'use strcit';
/**
 * Dependencies
 */
const request = require('supertest');
const { Person } = require('./person');
// const mongoose = require('mongoose');
const debug = require('debug')('supptext:test_person_api');

/**
 * Globals
 */
let server;

/**
 * Test Suite
 */
describe('api/v2/person', () => {
  /**
   * Setup & Cleanup
   */
  beforeEach(() => {
    debug('Connecting to server...');
    server = require('../../app');
  });
  afterEach(async () => {
    debug('Clearing all database entries...');
    await Person.deleteMany({});
    debug('Closing server connectiog...');
    await server.close();
  });

  /** TEST SUITES */

  describe('GET /phones', () => {
    /**
       * Locals
       */
    let token;

    /**
     * Valid call to server
     */
    const exec = async () => {
      debug('Executing server call to /api/v2/person/phones');
      return await request(server)
        .get('/api/v2/person/phones')
        .set('x-auth-token', token);
    };

    /**
     * Setup & Cleanup
     */
    beforeEach(async () => {
      debug('Creating new authorization token...');
      token = new Person({ isAdmin: true }).generateAuthToken();
      debug(`Generated token: ${token}`);
    });

    // Authentication
    it('should return 401 if no auth token is provided', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });
    it('should return 400 if auth token is invalid', async () => {
      token = 'a';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    // Response
    it('should return all registered phone numbers', async () => {
      debug('Inserting dummy person values...');
      await Person.collection.insertMany([
        {
          display_name: 'one',
          phone: '+44 12 524 5669'
        },
        {
          display_name: 'two',
          phone: '+22 12 524 5669'
        }
      ]);
      const res = await exec();

      debug(`Response: ${res.body}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(phone => phone === '+44 12 524 5669')).toBeTruthy();
      expect(res.body.some(phone => phone === '+22 12 524 5669')).toBeTruthy();
    });
  });

  describe('POST /', () => {
    let payload;

    beforeEach(() => {
      payload = {
        display_name: 'insertperson',
        phone: '+55 12 654 8523'
      };
    });

    /**
     * Vaid call to server
     */
    const exec = async () => {
      debug('Executing server call to /api/v2/person');
      return await request(server)
        .post('/api/v2/person')
        .send(payload);
    };

    // Validation
    it('should return 400 if phone number is already registered', async () => {
      payload.phone = '+33 65 636 5478';
      let res = await exec();
      res = await exec();
      expect(res.status).toBe(400);
    });

    // Response
    it('should return 201 if new person was created', async () => {
      const res = await exec();
      expect(res.status).toBe(201);
    });
    it('should return the newly created person', async () => {
      const res = await exec();
      expect(res.body).toHaveProperty('_id', res.body._id);
      expect(res.body).toHaveProperty('display_name', payload.display_name);
      expect(res.body).toHaveProperty('phone', payload.phone);
      expect(res.body).toHaveProperty('status', 'Supp! Want to chat?');
      expect(res.body).toHaveProperty('isAdmin', false);
      expect(res.body).toHaveProperty('active_conversations', []);
      expect(res.body).toHaveProperty('favourite_conversations', []);
      expect(res.body).toHaveProperty('favourite_messages', []);
      expect(res.body).toHaveProperty('favourite_persons', []);
      expect(res.body).toHaveProperty('blocked_persons', []);
    });
  });
//   describe('PATCH /personal/:id');
//   describe('DEBUG GET /debug/all');
//   describe('DEBUG DELETE /:id');
});
