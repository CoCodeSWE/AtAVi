const CuriosityWebhookService = require('./CuriosityWebhookService');
const CuriosityDAO = require('./CuriosityDAODynamoDB');
const GuestsDAO = require('../Guests/GuestsDAODynamoDB');
const aws = require('aws-sdk');

let client = new aws.DynamoDB.DocumentClient();
let curiosity = new CuriosityDAO(client);
let guests = new GuestsDAO(guests);

let service = new CuriosityWebhookService(curiosity,guests);

module.exports.webhook = service.webhook.bind(service);
