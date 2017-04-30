const RulesService = require('./RulesService');
const RulesDAODynamoDB = require('./RulesDAODynamoDB');
const TasksDAODynamoDB = require('./TasksDAODynamoDB');
const aws = require('aws-sdk');

let rulesdao = new RulesDAODynamoDB(new aws.DynamoDB.DocumentClient());
let tasksdao = new TasksDAODynamoDB(new aws.DynamoDB.DocumentClient());
let service = new RulesService(rulesdao,tasksdao);

module.exports.getTaskList = service.getTaskList.bind(service);
