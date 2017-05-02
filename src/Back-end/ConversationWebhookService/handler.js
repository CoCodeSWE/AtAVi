const ConversationWebhookService = require('./ConversationWebhookService');
const GuestsDAO = require('GuestsDAODynamoDB');
const ConversationsDAO = require('ConversationsDAODynamoDB');
const UsersDAO = require('UsersDAODynamoDB');
const aws = require('aws-sdk')

let client = new aws.DynamoDB.DocumentClient();
let users = new UsersDAO(client);
let conversations = new ConversationsDAO(client);
let guests = new GuestsDAO(client);


let service = new ConversationWebhookService(conversations, guests, users);

module.exports.webhook = service.webhook.bind(service);

//MANCA JWT CONVERSATIONWEBHOOKSERVICE!!!!!
