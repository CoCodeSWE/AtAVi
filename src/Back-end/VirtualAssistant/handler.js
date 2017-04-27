const VAService = require('./VAService');
const ApiAiVAAdapter = require('./ApiAiVAAdapter');
const AgentsDAODynamoDB = require('./AgentsDAODynamoDB');
const rp = require('request-promise');
const aws = require('aws-sdk');

let dao = new AgentsDAODynamoDB(new aws.DynamoDB.DocumentClient()); 
let adapter = new ApiAiVAAdapter(rp);
let service = new VAService(dao, adapter);

module.exports.query = service.query.bind(service);
