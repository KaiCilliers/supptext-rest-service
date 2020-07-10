/**
 * Dependencies
 */
const request = require('supertest');
const {Room} = require('../../../room/model');
const {User} = require('../../../user/model');
const mongoose = require('mongoose');
const debug = require('debug')('supptext:test_rooms');

/**
 * Globals
 */
let server;

/**
 * Test Suite
 */
describe('/api/rooms', () => {
    /**
     * Setup & Cleanup
     */
    beforeEach(async () => {
        server = require('../../../../app');
    });
    afterEach(async () => {
        await Room.deleteMany({});
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
                .get('/api/rooms')
                .set('x-auth-token', token);
        }

        /**
         * Setup & Cleanup
         */
        beforeEach(async () => {
            token = new User().generateAuthToken();
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
        it('should return all rooms', async () => {
            await Room.collection.insertMany([
                { private: true },
                { private: false }
            ]);
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(room => room.private === true)).toBeTruthy();
            expect(res.body.some(room => room.private === false)).toBeTruthy();
        });
    });

    /**
     * Test Suite
     */
    describe('GET /:id', () => {
        /**
         * Locals
         */
        let roomId;
        let token;

        /**
         * Valid call to server
         */
        const exec = async () => {
            return await request(server)
                .get(`/api/rooms/${roomId}`)
                .set('x-auth-token', token);
        }

        /**
         * Setup & Cleanup
         */
        beforeEach(async () => {
            roomId = mongoose.Types.ObjectId();
            token = new User().generateAuthToken();
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

        // Validation
        it('should return 404 if room id is invalid', async () => {
            roomId = '1';
            const res = await exec();
            expect(res.status).toBe(404);
        });

        // Response
        it('should return 404 if room with provided id was not found', async () => {
            const res = await exec();
            expect(res.status).toBe(404);
        });
        it('should return 200 if room was found', async () => {
            const room = new Room({ private: true });
            await room.save();
            roomId = room._id;

            const res = await exec();
            expect(res.status).toBe(200);
        });
        it('should return the room', async () => {
            const room = new Room({ private: true });
            await room.save();
            roomId = room._id;

            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('private');
            expect(res.body).toHaveProperty('created_at');
            expect(res.body).toHaveProperty('last_message');
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
        let token;

        /**
         * Setup & Cleanup
         */
        beforeEach(() => {
            token = new User().generateAuthToken();
            payload = {
                private: true
            }
        });

        /**
         * Valid call to server
         */
        const exec = async () => {
            return await request(server)
                .post('/api/rooms')
                .set('x-auth-token', token)
                .send(payload);
        }
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
        it('should return 400 if private boolean is invalid', async () => {
            payload = {};
            const res = await exec();
            expect(res.status).toBe(400);
        });

        // Response
        it('should return 201 if new room was created', async () => {
            const res = await exec();
            expect(res.status).toBe(201);
        });
        it('should return the newly created room', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('private');
            expect(res.body).toHaveProperty('created_at');
            expect(res.body).toHaveProperty('last_message');
        });
    });

    /**
     * Test Suite
     */
    describe('PUT /:id', () => {
        /**
         * Locals
         */
        let roomId;
        let payload;
        let token;

        /**
         * Setup & Cleanup
         */
        beforeEach(async () => {
            room = new Room({ private: true });
            await room.save();

            roomId = room._id;
            token = new User().generateAuthToken();
            payload = {
                private: false
            }
        });

        /**
         * Valid call to server
         */
        const exec = async () => {
            return await request(server)
                .put(`/api/rooms/${roomId}`)
                .set('x-auth-token', token)
                .send(payload);
        }
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
        it('should return 400 if private datatype is invalid', async () => {
            payload = {
                private: 1,
                date_created: Date.now
            }
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return 404 if room id is invalid', async () => {
            roomId = '1';
            const res = await exec();
            expect(res.status).toBe(404);
        });

        // Response
        it('should return 404 if room with provided id was not found', async () => {
            roomId = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });
        it('should return 200 if room was updated', async () => {
            const res = await exec();
            expect(res.status).toBe(200);
        });
        it('should return the updated room', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('private', false);
        });
    });

    /**
     * Test Suite
     */
    describe('DELETE /:id', () => {
        /**
         * Locals
         */
        let roomId;
        let token;

        /**
         * Setup & Cleanup
         */
        beforeEach(async () => {
            room = new Room({ private: true });
            await room.save();

            roomId = room._id;
            token = new User().generateAuthToken();
        });

        /**
         * Valid call to server
         */
        const exec = async () => {
            return await request(server)
                .delete(`/api/rooms/${roomId}`)
                .set('x-auth-token', token);
        }
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
        it('should return 404 if room id is invalid', async () => {
            roomId = '1';
            const res = await exec();
            expect(res.status).toBe(404);
        });
        
        // Response
        it('should return 404 if room with provided id was not found', async () => {
            roomId = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });
        it('should delete the room if input is valid', async () => {
            await exec();
            const roomInDb = await Room.findById(roomId);
            expect(roomInDb).toBeNull();
        });
        it('should return the deleted room', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('_id', room._id.toHexString());
        });
    });
});