//sarebbero tutti require, quelli che dobbiamo fare noi li lascio oggetti vuoti


'use strict';

const sns = require('aws-sdk').SNS;
const rp = require('request-promise');
const conversations = require('../Conversations/ConversationsDAODynamoDB');
const guests = require('../Guests/GuestsDAODynamoDB');

let VAMessageListener = new VAMessageListener(conversations, guests, rp);

module.exports.onMessage = function(event, context, callback)
{
  VAMessageListener.onMessage(event, context, callback);
}
