'use strict';

const sns = require('aws-sdk').SNS;
const rp = require('request-promise');
const ConversationsDAODynamoDB = require('ConversationsDAODynamoDB');
const GuestsDAODynamoDB = require('GuestsDAODynamoDB');
const VAMessageListener = require('./VAMessageListener')
const aws = require('aws-sdk');

//let guests_dao = new GuestsDAODynamoDB(new aws.DynamoDB.DocumentClient());
//let conversations_dao = new ConversationsDAODynamoDB(new aws.DynamoDB.DocumentClient());
let va_message_listener = new VAMessageListener(null, null, rp);

module.exports.onMessage = function(event, context, callback)
{
  va_message_listener.onMessage(event, context, callback);
}
