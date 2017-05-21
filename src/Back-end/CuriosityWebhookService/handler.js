const CuriosityWebhookService = require('./CuriosityWebhookService');
const CuriosityDAO = require('./CuriosityDAODynamoDB');
const GuestsDAO = require('./GuestsDAODynamoDB');
const aws = require('aws-sdk');

let client = new aws.DynamoDB.DocumentClient();
let curiosity = new CuriosityDAO(client);
let guests = new GuestsDAO(client);

let service = new CuriosityWebhookService(curiosity,guests);

module.exports.webhook = service.webhook.bind(service);
