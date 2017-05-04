//import sinon from 'sinon';
const  Rx = require('rxjs');
const sinon = require('sinon');

module.exports = {
  addConversation: sinon.stub(),
  getConversation: sinon.stub(),
  getConversationList: sinon.stub(),
  removeConversation: sinon.stub(),
  updateConversation: sinon.stub(),
  addMessage: sinon.stub()
}
