const AdministrationWebhookService = require('./AdministrationWebhookService');
const jwt = require('jsonwebtoken');

let service = new AdministrationWebhookService(jwt);

module.exports.webhook = service.webhook.bind(service);
