const ConversationApp = require('../Client/ConversationApp/ConversationApp');
const chai = require('chai');
const expect = chai.expect;

describe('Client', function() 
{
	describe('ConversationApp', function()
	{
		describe('ConversationApp', function()
		{
			describe('runCmd', function()
			{
				let conversation = new ConversationApp();				
				it('Il metodo deve chiamare il metodo dispatcher.dispatch inoltrandogli i parametri ricevuti.', function()
				{
					let cmd = 'msgReceived';
					let params = 
					{
						'text_request': 'richiesta',
						'text_response': 'risposta'
					}
					
					conversation.runCmd(cmd, params);
					
					expect(conversation.dispatcher.dispatch.callCount).to.equal(1);
					let params_dispatch = conversation.dispatcher.dispatch.getCall(0).args;
					
					expect(params_dispatch[0]).to.equal(cmd);
					expect(params_dispatch[1]).to.deep.equal(params);
				});
			});
		});
	});
});
