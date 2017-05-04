import {ConversationApp} from '../../Client/Applications/ConversationApp';
import Application from '../../Client/ApplicationManager/Application';

const expect = chai.expect;

describe('Client', function()
{
	describe('ConversationApp', function()
	{
		describe('ConversationApp', function()
		{			
			describe('runCmd', function()
			{
				it('Il metodo deve chiamare il metodo dispatcher.dispatch inoltrandogli i parametri ricevuti.', function(done)
				{
					let conversation = new Application(ConversationApp);
					document.getElementById("mocha").appendChild(conversation.ui);
					conversation.onload = function()
					{
						conversation.dispatcher.dispatch = sinon.stub();
						conversation.runCmd('cmd', 'params', ConversationApp.cmdHandler);
						expect(conversation.dispatcher.dispatch.callCount).to.equal(1);
						document.getElementById("mocha").removeChild(conversation.ui);
						done();
					};
				});
			});
		});
	});
});
