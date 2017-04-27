const VAService = require('./VAService');
const AgentsDAODynamoDB = require('./AgentsDAODynamoDB');
const aws = require('aws-sdk');

let dao = new AgentsDAODynamoDB(new aws.DynamoDB.DocumentClient()); 
let service = new VAService(dao);

module.exports.query = service.query.bind(service);
