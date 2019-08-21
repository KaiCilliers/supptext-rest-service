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

    describe('POST /', () => {
        /**
         * Locals
         */
        let token;
        let first_name;
        let last_name;
        let phone;
        let status;
        
        /**
         * Setup & Cleanup
         */
        beforeEach(() => {
            token = new User().generateAuthToken();
            first_name = 'first_name';
            last_name = 'last_name';
            phone = 'phone';
            status = 'status';
        });

        /**
         * Main Body
         */
        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ first_name, last_name, phone, status });
        }

        /**
         * Tests
         */
        // Auth
        it('should return 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        // Validation
        it('should return 400 if first_name is less than 2 characters', async () => {
            first_name = '1';
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return 400 if first_name is more than 50 characters', async () => {
            first_name = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });

        //Response
        it('should save the user if it is valid', async () => {
            await exec();
            const user = await User.find({ first_name: 'first_name'});
            expect(user).not.toBe(null);
        });
        it('should return the genre if it is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('first_name', 'first_name');
        });
    });

    describe('PUT /:id', () => {
        /**
         * Locals
         */
        let token;
        let newStatus;
        let user;
        let id;

        /**
         * Setup & Cleanup
         */
        beforeEach(async () => {
            const user = new User({
                first_name: 'first_name',
                last_name: 'last_name',
                phone: '+27-111-111-111',
                status: 'status'
            });
            await user.save();

            token = new User().generateAuthToken();
            id = user._id;
            newStatus = 'updateStatus';
        });

        /**
         * Main Body
         */
        const exec = async () => {
            return await request(server)
                .put(`/api/users/${id}`)
                .set('x-auth-token', token)
                .send({ status: newStatus });
        }

        /**
         * Tests
         */
        // Auth
        it('should return 401 if client is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        // Validation
        it('should return 400 if status is less than 1 character', async () => {
            newStatus = '1';
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return 400 if status is more than 255 characters', async () => {
            newStatus = new Array(257).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return 404 if id is invalid', async () => {
            id = 1;
            const res = await exec();
            expect(res.status).toBe(404);
        });
        it('should return 404 if genre with the given id was not found', async () => {
            id = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });

        // Response
        it('should update the status of user if input is valid', async () => {
            await exec();
            const updateUser = await User.findById(user._id);
            expect(updateUser.status).toBe(newStatus);
        });
        it('should return the updated user if it is valid', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('status', newStatus);
        });
    });

    describe('DELETE /:id', () => {
        /**
         * Locals
         */
        let token;
        let user;
        let id;

        /**
         * Setup & Cleanup
         */
        beforeEach(async () => {
            const user = new User({
                first_name: 'first_name',
                last_name: 'last_name',
                phone: '+27-111-111-111',
                status: 'status'
            });
            await user.save();

            token = new User({ isDev: true }).generateAuthToken();
            id = user._id;
        });

        /**
         * Main Body for happy path
         */
        const exec = async () => {
            return await request(server)
                .delete(`/api/users/${id}`)
                .set('x-auth-token', token)
                .send();
        }

        /**
         * Tests
         */
        // Auth
        it('should return 401 if client is nog logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });
        it('should return 403 if the user is not a dev', async () => {
            token = new User({ isDev: false }).generateAuthToken();
            const res = await exec();
            expect(res.status).toBe(403);
        });

        // Validation
        it('should return 404 if id is invalid', async () => {
            id = 1;
            const res = await exec();
            expect(res.status).toBe(404);
        });
        it('should return 404 if no user with the given id was found', async () => {
            id = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });

        // Response
        it('should delete the user if input is valid', async () => {
            await exec();
            const userInDb = await User.findById(id);
            expect(userInDb).toBeNull();
        });
        it('should return the removed user', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('_id', user._id.toHexString());
            expect(res.body).toHaveProperty('first_name', user.first_name);
        });
    });
});