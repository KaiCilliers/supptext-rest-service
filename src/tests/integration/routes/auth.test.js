/**
 * Dependencies
 */
const request = require('supertest');
const {User} = require('../../../user/model');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const debug = require('debug')('supptext:test_auth');

/**
 * Globals
 */
let server

/**
 * Test Suite
 */
describe('api/auth', () => {
    /**
     * Setup & Cleanup
     */
    beforeEach(() => { server = require('../../../../app') });
    afterEach(async () => {
        await User.deleteMany({});
        await server.close();
    });

    /**
     * Test Suite
     */
    describe('POST /', () => {
        /**
         * Locals
         */
        let payload;
        let password;
        let phone;

        /**
         * Setup & Cleanup
         */
        beforeEach(async () => {
            phone = '+27-842-564-552';
            password = 'password123';
            payload = {
                phone: phone,
                password: password
            }
            await request(server)
                .post('/api/users')
                .send({
                    first_name: "12",
                    last_name: "123",
                    phone: phone,
                    password: password
                })
        });
        afterEach(async () => {
            await User.deleteMany({});
        });

        /**
         * Valid call to server
         */
        const exec = async () => {
            return await request(server)
                .post('/api/auth')
                .send(payload)
        }

        // Validation
        it('should return 400 if no phone number is provided', async () => {
            payload = { password: payload.password }
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return 400 if phone number is less than 5 characters', async () => {
            payload.phone = '1234';
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return 400 if phone number is more than 255 characters', async () => {
            payload.phone = new Array(257).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return 400 if no password is provided', async () => {
            payload = { phone: payload.phone }
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return 400 if password is less than 5 characters', async () => {
            payload.password = '1234';
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return 400 if password is more than 255 characters', async () => {
            payload.password = new Array(257).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return 400 if invalid password is provided', async () => {
            payload.password = 'newpassword';
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should return 404 if no user with provided phone number was found', async() => {
            payload.phone = '1234567890';
            const res = await exec();
            expect(res.status).toBe(404)
        });

        // Response
        it('should return 200 if login was successfull', async () => {
            const res = await exec();
            expect(res.status).toBe(200);
        });
        it('should return auth token if login was successfull', async () => {
            const res = await exec();
            expect(res.body).not.toBeNull();
        });
    });
});