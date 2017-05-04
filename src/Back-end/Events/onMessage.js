//sarebbero tutti require, quelli che dobbiamo fare noi li lascio oggetti vuoti


'use strict';

const sns = require('aws-sdk').SNS;
const rp = require('request-promise');
const ConversationsDAODynamoDB = require('../Conversations/ConversationsDAODynamoDB');
const GuestsDAODynamoDB = require('../Guests/GuestsDAODynamoDB');
const VAMessageListener = require('./VAMessageListener')
const aws = require('aws-sdk');

let guests_dao = new GuestsDAODynamoDB(new aws.DynamoDB.DocumentClient());
let conversations_dao = new ConversationsDAODynamoDB(new aws.DynamoDB.DocumentClient());
let va_message_listener = new VAMessageListener(conversations_dao, guests_dao, rp);
/*
var event =
{
	"Records": [{
		"Sns": {
			"Message": "ciao",
		    "session_id":"3455"
		}
	}]
};
console.log('out:'+event);
va_message_listener.onMessage(event, {}, (err, data)=>{if(err) console.log("errore"); else console.log(data);});
*/
module.exports.onMessage = function(event, context, callback)
{
  va_message_listener.onMessage(event, context, callback);
}
