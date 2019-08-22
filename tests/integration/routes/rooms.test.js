/**
 * Dependencies
 */
const request = require('superTest');
const {Room} = require('../../../models/room');
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
     * Locals
     */
    let room;
    /**
     * Setup & Cleanup
     */
    beforeEach(async () => {
        server = require('../../../index');
    });
    afterEach(async () => {
        await Room.deleteMany({});
        await server.close();
    });

    /**
     * Test Suite
     */
    describe('GET /', () => {
        // Auth
        it('should return 400 if no auth token is provided');
        it('should return 401 if auth token is invalid');

        // Response
        it('should return all rooms', async () => {
            const res = await request(server).get('/api/rooms');

            expect(res.status).toBe(200);
            expect(res.body.some(data => data.private === true)).toBeTruthy();
        });
    });

    /**
     * Test Suite
     */
    describe('GET /:id', () => {
        // Auth
        it('should return 400 if no auth token is provided');
        it('should return 401 if auth token is invalid');

        // Validation
        it('should return 400 if no room id was provided');
        it('should return 400 if room id is invalid');

        // Response
        it('should return 404 if room with provided id was not found');
        it('should return 200 if room was found');
        it('should return the room');
    });

    /**
     * Test Suite
     */
    describe('POST /', () => {
        // Auth
       it('should return 400 if no auth token is provided');
       it('should return 401 if auth token is invalid');

       // Validation
       it('should return 400 if no private boolean was provided');

       // Response
       it('should return 201 if new room was created');
       it('should return the newly created room');
    });

    /**
     * Test Suite
     */
    describe('PUT /:id', () => {
        // Auth
       it('should return 400 if no auth token is provided');
       it('should return 401 if auth token is invalid');

       // Validation
       it('should return 400 if no private boolean was provided');
       it('should return 400 if no room id was provided');
       it('should return 400 if room id is invalid');

       // Response
       it('should return 404 if room with provided id was not found');
       it('should return 200 if room was updated');
       it('should return the newly created room');
    });

    /**
     * Test Suite
     */
    describe('DELETE /:id', () => {
        // Auth
        it('should return 400 if no auth token is provided');
        it('should return 401 if auth token is invalid');

        // Validation
        it('should return 400 if no room id was provided');
        it('should return 400 if room id is invalid');
        
        // Response
        it('should return 404 if room with provided id was not found');
        it('should return 204 if room was deleted');
        it('should return the deleted room');
    });
});