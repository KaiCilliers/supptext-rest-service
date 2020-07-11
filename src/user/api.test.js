/**
 * Dependencies
 */
const request = require('supertest');
const { User } = require('./model');
const mongoose = require('mongoose');

/**
 * Globals
 */
let server;

/**
 * Test Suite
 */
describe('/api/users', () => {
  /**
     * Setup & Cleanup
     */
  beforeEach(() => { server = require('../../app'); });
  afterEach(async () => {
    await User.deleteMany({});
    await server.close();
  });

  /**
     * Test Suite
     */
  describe('GET /', () => {
    /**
         * Locals
         */
    let token;

    /**
         * Valid call to server
         */
    const exec = async () => {
      return await request(server)
        .get('/api/users')
        .set('x-auth-token', token);
    };

    /**
         * Setup & Cleanup
         */
    beforeEach(async () => {
      token = new User({ isAdmin: true }).generateAuthToken();
    });

    // Auth
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
    it('should return 403 if user is not an admin', async () => {
      token = new User().generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    // Response
    it('should return all users if user is an admin', async () => {
      await User.collection.insertMany([
        {
          first_name: 'n1',
          last_name: 'sur',
          phone: '1234567890',
          password: 'password1'
        },
        {
          first_name: 'n2',
          last_name: 'su2',
          phone: '12345678901',
          password: 'password2'
        }
      ]);
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(user => user.first_name === 'n1')).toBeTruthy();
      expect(res.body.some(user => user.last_name === 'su2')).toBeTruthy();
    });
  });

  /**
     * Test Suite
     */
  describe('GET /me', () => {
    /**
         * Locals
         */
    let token;

    /**
         * Valid call to server
         */
    const exec = async () => {
      return await request(server)
        .get('/api/users/me')
        .set('x-auth-token', token);
    };

    /**
         * Setup & Cleanup
         */
    beforeEach(async () => {
      const user = new User({
        first_name: 'fname',
        last_name: 'lname',
        phone: '01234567890',
        password: 'password1'
      });
      await user.save();
      token = user.generateAuthToken();
    });
    // Auth
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
    it('should return the user', async () => {
      const res = await exec();
      expect(res.body).toHaveProperty('first_name');
      expect(res.body).toHaveProperty('last_name');
      expect(res.body).toHaveProperty('phone');
      expect(res.body).toHaveProperty('status');
    });
  });

  /**
     * Test Suite
     */
  describe('POST /', () => {
    /**
         * Locals
         */
    let payload;

    /**
         * Setup & Cleanup
         */
    beforeEach(() => {
      payload = {
        first_name: '12',
        last_name: '123',
        phone: '1234567890',
        status: 'h',
        password: 'password1'
      };
    });

    /**
         * Valid call to server
         */
    const exec = async () => {
      return await request(server)
        .post('/api/users')
        .send(payload);
    };

    // Validation
    it('should return 400 if first_name is less than 2 characters', async () => {
      payload.first_name = '1';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if first_name is more than 50 characters', async () => {
      payload.first_name = new Array(52).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if last_name is less than 3 characters', async () => {
      payload.last_name = '2';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if last_name is more than 50 characters', async () => {
      payload.last_name = new Array(52).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if phone number is less than 10 characters', async () => {
      payload.phone = '9';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if phone number is more than 15 characters', async () => {
      payload.phone = new Array(17).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if a user exists with provided phone number', async () => {
      payload.phone = '0987654321';
      let res = await exec();
      res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if status is less than 1 character', async () => {
      payload.status = '';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if status is more than 255 characters', async () => {
      payload.first_name = new Array(257).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    // Response
    it('should return 201 if new user was created', async () => {
      const res = await exec();
      expect(res.status).toBe(201);
    });
    it('should return the newly created user', async () => {
      const res = await exec();
      expect(res.body).toHaveProperty('first_name', payload.first_name);
      expect(res.body).toHaveProperty('last_name', payload.last_name);
      expect(res.body).toHaveProperty('phone', payload.phone);
      expect(res.body).toHaveProperty('status', payload.status);
      // TODO Test for x-auth-header
    });
  });

  /**
     * Test Suite
     */
  describe('PATCH /:id', () => {
    /**
         * Locals
         */
    let userId;
    let payload;
    let token;
    let firstName;
    let lastName;
    let phone;
    let status;

    /**
         * Setup & Cleanup
         */
    beforeEach(async () => {
      firstName = '11';
      lastName = '111';
      phone = '0987654321';
      status = 'a';
      const user = new User({
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        status: status,
        password: 'password1'
      });
      await user.save();

      userId = user._id;
      token = new User().generateAuthToken();
      payload = {
        first_name: '11',
        last_name: '111',
        phone: '0987654321',
        status: 'a',
        password: 'password1'
      };
    });
    afterEach(async () => {
      await User.deleteMany({});
    });

    /**
         * Valid call to server
         */
    const exec = async () => {
      return await request(server)
        .patch(`/api/users/${userId}`)
        .set('x-auth-token', token)
        .send(payload);
    };

    // Auth
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

    // Validation
    it('should return 400 if first_name is less than 2 characters', async () => {
      payload.first_name = '1';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if first_name is more than 50 characters', async () => {
      payload.first_name = new Array(52).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if last_name is less than 3 characters', async () => {
      payload.last_name = '2';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if last_name is more than 50 characters', async () => {
      payload.last_name = new Array(52).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if phone number is less than 10 characters', async () => {
      payload.phone = '9';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if phone number is more than 15 characters', async () => {
      payload.phone = new Array(17).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if status is less than 1 character', async () => {
      payload.status = '';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if status is more than 255 characters', async () => {
      payload.first_name = new Array(257).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    // Response
    it('should return 404 if user with provided id was not found', async () => {
      userId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });
    it('should return 200 if first_name was updated successfully', async () => {
      payload = { first_name: 'newName' };
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('first_name', 'newName');
      expect(res.body).toHaveProperty('last_name', lastName);
      expect(res.body).toHaveProperty('phone', phone);
      expect(res.body).toHaveProperty('status', status);
    });
    it('should return 200 if last_name was updated successfully', async () => {
      payload = { last_name: 'newSur' };
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('first_name', firstName);
      expect(res.body).toHaveProperty('last_name', 'newSur');
      expect(res.body).toHaveProperty('phone', phone);
      expect(res.body).toHaveProperty('status', status);
    });
    it('should return 200 if status was updated successfully', async () => {
      payload = { status: 'newStat' };
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('first_name', firstName);
      expect(res.body).toHaveProperty('last_name', lastName);
      expect(res.body).toHaveProperty('phone', phone);
      expect(res.body).toHaveProperty('status', 'newStat');
    });
  });

  /**
     * Test Suite
     */
  describe('DELETE /:id', () => {
    /**
         * Locals
         */
    let userId;
    let token;

    /**
         * Setup & Cleanup
         */
    beforeEach(async () => {
      const user = new User({
        first_name: '12',
        last_name: '123',
        phone: '1234567890',
        status: 'h',
        password: 'password1'
      });
      await user.save();

      userId = user._id;
      token = new User({ isAdmin: true }).generateAuthToken();
    });

    /**
         * Valid call to server
         */
    const exec = async () => {
      return await request(server)
        .delete(`/api/users/${userId}`)
        .set('x-auth-token', token);
    };
    // Auth
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

    // Validation
    it('should return 404 if user id is invalid', async () => {
      userId = '1';
      const res = await exec();
      expect(res.status).toBe(404);
    });

    // Response
    it('should return 404 if user with provided id was not found', async () => {
      userId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });
    it('should delete the user if input is valid', async () => {
      await exec();
      const userInDb = await User.findById(userId);
      expect(userInDb).toBeNull();
    });
    it('should return the deleted user', async () => {
      const res = await exec();
      expect(res.body).toHaveProperty('_id', userId.toHexString());
    });
  });
});
