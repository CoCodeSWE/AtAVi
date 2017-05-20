const CuriosityWebhookService = require('./CuriosityWebhookService');
const CuriosityDAO = require('./CuriosityDAODynamoDB');
const aws = require('aws-sdk');

let client = new aws.DynamoDB.DocumentClient();
let curiosity = new CuriosityDAO(client);

let service = new CuriosityWebhookService(curiosity);

module.exports.webhook = service.webhook.bind(service);
