'use strcit';
/**
 * Dependencies
 */
const express = require('express');
const morgan = require('morgan');
const winston = require('../../config/winston');
const error = require('../middleware/error/error');
const debug = require('debug')('supptext:routes');
const users = require('../user/userAPI');
const rooms = require('../room/roomAPI');
const participants = require('../participant/participantAPI');
const messages = require('../message/messageAPI');
const person = require('../person/personAPI');
const conversation = require('../conversation/conversationAPI');
const auth = require('../login/loginAPI');

/**
 * Setup Middleware
 */
module.exports = function (app) {
  app.use(express.json());
  if (app.get('env') === 'development') {
    app.use(morgan('combined', { stream: winston.stream }));
    debug('Morgan enabled...');
  }
  app.use('/api/v2/person', person);
  app.use('/api/v2/conversation', conversation);
  app.use('/api/users', users);
  app.use('/api/rooms', rooms);
  app.use('/api/participants', participants);
  app.use('/api/messages', messages);
  app.use('/api/auth', auth);
  app.use(error);
};
