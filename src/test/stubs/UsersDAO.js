//import sinon from 'sinon';
const  Rx = require('rxjs');
const sinon = require('sinon');

module.exports = {
  addUser: sinon.stub(),
  getUser: sinon.stub(),
  getUserList: sinon.stub(),
  removeUser: sinon.stub(),
  updateUser: sinon.stub()
}
