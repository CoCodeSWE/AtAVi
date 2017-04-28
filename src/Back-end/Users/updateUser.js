const UsersService = require('./UsersService');
const UsersDAODynamoDB = require('./UsersDAODynamoDB');
const aws = require('aws-sdk');

let dao = new UsersDAODynamoDB(new aws.DynamoDB.DocumentClient());
let service = new UsersService(dao);

module.exports.updateUser = service.updateUser.bind(service);