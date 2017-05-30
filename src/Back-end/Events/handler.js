'use strict';

const sns = require('aws-sdk').SNS;
const rp = require('request-promise');
const ConversationsDAODynamoDB = require('ConversationsDAODynamoDB');
const GuestsDAODynamoDB = require('GuestsDAODynamoDB');
const VAMessageListener = require('./VAMessageListener')
const aws = require('aws-sdk');

let guests_dao = new GuestsDAODynamoDB(new aws.DynamoDB.DocumentClient());
let conversations_dao = new ConversationsDAODynamoDB(new aws.DynamoDB.DocumentClient());
let va_message_listener = new VAMessageListener(conversations_dao, guests_dao, rp);

module.exports.notify = va_message_listener.notify.bind(va_message_listener);
module.exports.updateGuest = va_message_listener.updateGuest.bind(va_message_listener);
module.exports.saveConvesation = va_message_listener.saveConversation.bind(va_message_listener);
