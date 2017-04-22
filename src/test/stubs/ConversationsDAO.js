const sinon = require('sinon');

module.exports = 
{
	addConversation: sinon.stub(),
	addMessage: sinon.stub(),
	getConversation: sinon.stub(),
	getConversationList: sinon.stub(),
	removeConversation: sinon.stub()
}