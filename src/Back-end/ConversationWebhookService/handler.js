const ConversationWebhookService = require('./ConversationWebhookService');
const jwt = require('jsonwebtoken');

let service = new ConversationWebhookService();

module.exports.webhook = service.webhook.bind(service);

//MANCA JWT CONVERSATIONWEBHOOKSERVICE!!!!!
