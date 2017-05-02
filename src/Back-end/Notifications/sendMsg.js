const NotificationService = require('./NotificationService');



var WebClient = require('@slack/client').WebClient;
var token = process.env.SLACK_API_TOKEN;
var client = new WebClient(token);

let service = new NotificationService(client);

module.exports.sendMsg = service.sendMsg.bind(service);
