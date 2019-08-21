/**
 * Dependencies
 */
const request = require('superTest');
const {User} = require('../../../models/user');
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
    beforeEach(() => { server = require('../../../index') });
    afterEach(async () => {
        await User.remove({});
        await server.close();
    });

    /**
     * TESTS
     */
    describe('GET /', () => {
        it('should return all users', async () => {
            // populate test DB
            await User.collection.insertMany([
                {
                    first_name: 'Kai',
                    last_name: 'Cilliers',
                    phone: '+27-111-222-333',
                    status: 'statsadsadsad'
                },
                {
                    first_name: 'Nadine',
                    last_name: 'Balanco',
                    phone: '+27-333-222-333',
                    status: 'statttttt'
                }
        ]);

        const res = await request(server).get('/api/users');

        expect(res.status).toBe(200);
        expect(res.body.some(u => u.first_name === 'Kai')).toBeTruthy();
        expect(res.body.some(u => u.first_name === 'Nadine')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        // Validation
        it('should return 404 if no user with given id exists', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get(`/api/users/${id}`);
            expect(res.status).toBe(404);
        });
        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/users/1');
            expect(res.status).toBe(404);
        });

        // Response
        it('should return a user if a valid id is passed', async () => {
            const user = new User({
                first_name: 'Kai',
                last_name: 'Cilliers',
                phone: '+27-111-222-333',
                status: 'status'
            });
            await user.save();

            const res = await request(server).get(`/api/users/${user._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('first_name', user.first_name);
        });
    });
});