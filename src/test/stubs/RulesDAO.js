//import sinon from 'sinon';
const  Rx = require('rxjs');
const sinon = require('sinon');

module.exports = {
  addRule: sinon.stub(),
  getRule: sinon.stub(),
  getRulesList: sinon.stub(),
  query: sinon.stub(),
  removeRule: sinon.stub(),
  updateRule: sinon.stub()
}
