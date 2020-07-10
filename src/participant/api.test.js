/**
 * Dependencies
 */
const request = require('supertest');
const mongoose = require('mongoose');
const {Participant} = require('./model');
const {User} = require('../user/model');
const {Room} = require('../room/model');

/**
 * Server
 */
let server;

/**
 * Test Suite
 */
describe('/api/participants', () => {
    /**
     * Setup & Cleanup
     */
    beforeEach(async () => {
        server = require('../../app');
    });
    afterEach(async () => {
        await Participant.deleteMany({});
        await User.deleteMany({});
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
                .get('/api/participants')
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
        it('should return all participants', async () => {
            const roomId = mongoose.Types.ObjectId();
            const user1Id = mongoose.Types.ObjectId();
            const user2Id = mongoose.Types.ObjectId();
            await Participant.collection.insertMany([
                {
                    room: {
                        _id: roomId,
                        created_at: Date.now,
                        private: true,
                        last_name: Date.now
                    },
                    user: {
                        _id: user1Id,
                        first_name: '11',
                        last_name: '123',
                        phone: '1234567890',
                        status: '1',
                        password: 'password1'
                    },
                    admin: true,
                    creator: true
                },
                {
                    room: {
                        _id: roomId,
                        created_at: Date.now,
                        private: false,
                        last_name: Date.now
                    },
                    user: {
                        _id: user2Id,
                        first_name: '22',
                        last_name: '333',
                        phone: '12345678901',
                        status: '2',
                        password: 'password1'
                    },
                    admin: false,
                    creator: false
                }
            ]);
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(p => p.room._id === roomId.toHexString())).toBeTruthy();
            expect(res.body.some(p => p.user._id === user1Id.toHexString())).toBeTruthy();
            expect(res.body.some(p => p.user._id === user2Id.toHexString())).toBeTruthy();
            expect(res.body.some(p => p.admin === true)).toBeTruthy();
            expect(res.body.some(p => p.admin === false)).toBeTruthy();
            expect(res.body.some(p => p.creator === true)).toBeTruthy();
            expect(res.body.some(p => p.creator === false)).toBeTruthy();
        });
    });
    
    /**
     * Test Suite
     */
    describe('GET /:id', () => {
        /**
         * Locals
         */
        let participantId;
        let token;

        /**
         * Valid call to server
         */
        const exec = async () => {
            return await request(server)
                .get(`/api/participants/${participantId}`)
                .set('x-auth-token', token);
        }

        /**
         * Setup & Cleanup
         */
        beforeEach(async () => {
            participantId = mongoose.Types.ObjectId();
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
        it('should return 404 if participant id is invalid', async () => {
            participantId = '1';
            const res = await exec();
            expect(res.status).toBe(404);
        });

        // Response
        it('should return 404 if participant with provided id was not found', async () => {
            const res = await exec();
            expect(res.status).toBe(404);
        });
        it('should return the participant if input is valid', async () => {
            user = new User({
                _id: mongoose.Types.ObjectId(),
                first_name: '12',
                last_name: '123',
                phone: '1234567890',
                status: '1',
                password: 'password1'
            });
            await user.save();

            room = new Room({
                _id: mongoose.Types.ObjectId(),
                created_at: Date.now(),
                private: true,
                last_message: Date.now()
            });
            await room.save();

            const userInDb = await user.save();
            const roomInDb = await room.save();
            
            const participant = new Participant({
                room: {
                    _id: roomInDb._id,
                    private: roomInDb.private,
                    last_message: roomInDb.last_message
                },
                user: {
                    _id: userInDb._id,
                    first_name: userInDb.first_name,
                    phone: userInDb.phone,
                    password: userInDb.password
                },
                admin: false,
                creator: false
            });
            await participant.save();

            participantId = participant._id;

            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id', participantId.toHexString());
            expect(res.body).toHaveProperty('user._id', userInDb._id.toHexString());
            expect(res.body).toHaveProperty('room._id', roomInDb._id.toHexString());
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
        let userId;
        let roomId;

        /**
         * Setup & Cleanup
         */
        beforeEach(async () => {
            userId = mongoose.Types.ObjectId();
            roomId = mongoose.Types.ObjectId();
            token = new User().generateAuthToken();

            user = new User({
                _id: userId,
                first_name: '12',
                last_name: '123',
                phone: '1234567890',
                status: '1',
                password: 'password1'
            });
            await user.save();

            room = new Room({
                _id: roomId,
                created_at: Date.now(),
                private: true,
                last_message: Date.now()
            });
            await room.save();

            payload = {
                userId,
                roomId
            }
        });

        /**
         * Valid call to server
         */
        const exec = async () => {
            return await request(server)
                .post('/api/participants')
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
        it('should return 400 if userId is not provided', async () => {
            payload.userId = '';
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return 400 if roomId is not provided', async () => {
            payload.roomId = '';
            const res = await exec();
            expect(res.status).toBe(400);
        });
        
        // // Validation
        it('should return 400 if userId is invalid', async () => {
            payload.userId = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return 400 if roomId is invalid', async () => {
            payload.roomId = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(400);
        });

        // Response
        it('should return 201 if new participant was created', async () => {
            const res = await exec();
            expect(res.status).toBe(201);
        });
        it('should return the newly created participant', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('room._id', roomId.toHexString());
            expect(res.body).toHaveProperty('room.private');
            expect(res.body).toHaveProperty('user._id', userId.toHexString());
            expect(res.body).toHaveProperty('user.first_name');
            expect(res.body).toHaveProperty('user.phone');
            expect(res.body).toHaveProperty('admin', false);
            expect(res.body).toHaveProperty('creator', false);
        });
    });

    /**
     * Test Suite
     */
    describe('DELETE /:id', () => {
        /**
         * Locals
         */
        let participantId;
        let token;

        /**
         * Setup & Cleanup
         */
        beforeEach(async () => {
            participant = new Participant({
                room: {
                    _id: mongoose.Types.ObjectId(),
                    private: true,
                    last_message: Date.now()
                },
                user: {
                    _id: mongoose.Types.ObjectId(),
                    first_name: '12',
                    phone: '1234567890',
                    password: 'password1'
                },
                admin: false,
                creator: false
            });
            await participant.save();

            participantId = participant._id;
            token = new User().generateAuthToken();
        });

        /**
         * Valid call to server
         */
        const exec = async () => {
            return await request(server)
                .delete(`/api/participants/${participantId}`)
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
        it('should return 404 if participant id is invalid', async () => {
            participantId = '1';
            const res = await exec();
            expect(res.status).toBe(404);
        });

        // Response
        it('should return 404 if participant with provided id was not found', async () => {
            participantId = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });
        it('should delete the participant if input is valid', async () => {
            await exec();
            const participantInDb = await Participant.findById(participantId);
            expect(participantInDb).toBeNull();
        });
        it('should return the deleted room', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('_id', participant._id.toHexString());
        });
    });
});