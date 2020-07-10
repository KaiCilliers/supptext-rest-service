/**
 * Dependencies
 */
const request = require('supertest');
const mongoose = require('mongoose');
const {Message} = require('../../../models/message');
const {User} = require('../../../models/user');
const {Room} = require('../../../models/room');

/**
 * Server
 */
let server;

/**
 * Test Suite
 */
describe('/api/messages', () => {
    /**
     * Setup & Cleanup
     */
    beforeEach(async () => {
        server = require('../../../index');
    });
    afterEach(async () => {
        await Message.deleteMany({});
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
                .get('/api/messages')
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
        it('should return all messages', async () => {
            const roomId = mongoose.Types.ObjectId();
            const user1Id = mongoose.Types.ObjectId();
            const user2Id = mongoose.Types.ObjectId();
            await Message.collection.insertMany([
                {
                    room : {
                        _id: roomId,
                        last_message: Date.now()
                    },
                    user: {
                        _id: user1Id,
                        first_name: '12',
                        phone: '1234567890',
                        password: 'password1'
                    },
                    content: '1',
                    sent: true,
                    received: false
                },
                {
                    room : {
                        _id: roomId,
                        last_message: Date.now()
                    },
                    user: {
                        _id: user2Id,
                        first_name: '33',
                        phone: '0987654321',
                        password: 'password2'
                    },
                    content: '2',
                    sent: true,
                    received: false
                }
            ]);
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(m => m.room._id === roomId.toHexString())).toBeTruthy();
            expect(res.body.some(m => m.user._id === user1Id.toHexString())).toBeTruthy();
            expect(res.body.some(m => m.user._id === user2Id.toHexString())).toBeTruthy();
            expect(res.body.some(m => m.user.first_name === '12')).toBeTruthy();
            expect(res.body.some(m => m.user.first_name === '33')).toBeTruthy();
            expect(res.body.some(m => m.content === '1')).toBeTruthy();
            expect(res.body.some(m => m.content === '2')).toBeTruthy();
            expect(res.body.some(m => m.sent === true)).toBeTruthy();
            expect(res.body.some(m => m.received === false)).toBeTruthy();
        });
    });
    
    /**
     * Test Suite
     */
    describe('GET /:id', () => {
        /**
         * Locals
         */
        let messageId;
        let token;

        /**
         * Valid call to server
         */
        const exec = async () => {
            return await request(server)
                .get(`/api/messages/${messageId}`)
                .set('x-auth-token', token);
        }

        /**
         * Setup & Cleanup
         */
        beforeEach(async () => {
            messageId = mongoose.Types.ObjectId();
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
        it('should return 404 if message id is invalid', async () => {
            messageId = '1';
            const res = await exec();
            expect(res.status).toBe(404);
        });

        // Response
        it('should return 404 if message with provided id was not found', async () => {
            const res = await exec();
            expect(res.status).toBe(404);
        });
        it('should return the message if input is valid', async () => {
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
            
            const message = new Message({
                room : {
                    _id: roomInDb._id,
                    last_message: roomInDb.last_message
                },
                user: {
                    _id: userInDb._id,
                    first_name: userInDb.first_name,
                    phone: userInDb.phone,
                    password: userInDb.password
                },
                content: '1',
                sent: true,
                received: false
            });
            await message.save();

            messageId = message._id;

            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id', messageId.toHexString());
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
        let content;

        /**
         * Setup & Cleanup
         */
        beforeEach(async () => {
            userId = mongoose.Types.ObjectId();
            roomId = mongoose.Types.ObjectId();
            content = '1';
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
                roomId,
                content
            }
        });
        afterEach(async () => {
            await Message.deleteMany({});
            await User.deleteMany({});
            await Room.deleteMany({});
        });

        /**
         * Valid call to server
         */
        const exec = async () => {
            return await request(server)
                .post('/api/messages')
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

        // Validation
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
        it('should return 400 if content is less than 1 character', async () => {
            payload.content = '';
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return 400 if content is more than 255 character', async () => {
            payload.content = new Array(257).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });

        // Response
        it('should return 201 if new message was created', async () => {
            const res = await exec();
            expect(res.status).toBe(201);
        });
        it('should return the newly created message', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('room._id', roomId.toHexString());
            expect(res.body).toHaveProperty('room.last_message');
            expect(res.body).toHaveProperty('user._id', userId.toHexString());
            expect(res.body).toHaveProperty('user.first_name');
            expect(res.body).toHaveProperty('user.phone');
            expect(res.body).toHaveProperty('content', '1');
            expect(res.body).toHaveProperty('sent', false);
            expect(res.body).toHaveProperty('received', false);
        });
    });

    /**
     * Test Suite
     */
    describe('DELETE /', () => {
        /**
         * Locals
         */
        let messageId;
        let token;

        /**
         * Setup & Cleanup
         */
        beforeEach(async () => {
            message = new Message({
                room : {
                    _id: mongoose.Types.ObjectId(),
                    last_message: Date.now()
                },
                user: {
                    _id: mongoose.Types.ObjectId(),
                    first_name: '12',
                    phone: '1234567890',
                    password: 'password1'
                },
                content: '1',
                sent: true,
                received: false
            });
            await message.save();

            messageId = message._id;
            token = new User().generateAuthToken();
        });

        /**
         * Valid call to server
         */
        const exec = async () => {
            return await request(server)
                .delete(`/api/messages/${messageId}`)
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
        it('should return 404 if message id is invalid', async () => {
            messageId = '1';
            const res = await exec();
            expect(res.status).toBe(404);
        });

        // Response
        it('should return 404 if message with provided id was not found', async () => {
            messageId = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });
        it('should delete the message if input is valid', async () => {
            await exec();
            const messageInDb = await Message.findById(messageId);
            expect(messageInDb).toBeNull();
        });
        it('should return the deleted message', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('_id', message._id.toHexString());
        });
    });
});