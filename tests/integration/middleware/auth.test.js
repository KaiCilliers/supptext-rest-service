/**
 * Dependencies
 */
const request = require('supertest');
const {Room} = require('../../../models/room');
const {User} = require('../../../models/user');

/**
 * Globals
 */
let server;

/**
 * Test Suite
 */
describe('auth middleware', () => {
    /**
     * Locals
     */
    let token;

    /**
     * Setup & Cleanup
     */
    beforeEach(() => {
        server = require('../../../index');
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
    }

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