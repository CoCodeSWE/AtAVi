const VAMessageListener = require('../Back-end/Events/VAMessageListener');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const conversations = require('./stubs/ConversationsDAO');
const guests = require('./stubs/GuestsDAO');
const promise = require('./stubs/RequestPromise');

let callback;
beforeEach(function()
{
	callback = sinon.stub(guests, conversations, rp);
});

let event = 
{
	Records:
	[
		{
			Sns:
			{
				Message: 'Oh bella',
				MessageAttributes:
				{
					action: 'action'
				},
				MessageId: 2,
				Subject: 'subject',
				Timestamp: new Date().toISOString();
			}
		}
	]
}
	
describe('Back-end', function()
{
  describe('Events', function()
  {
    describe('VAMessageListener', function()
    {
			let listener = new VAMessageListener(conversations, guests, promise);
      describe('onMessage', function()
      {
        it("Nel caso in cui la chiamata al microservizio \\file{Notification} non vada a buon fine, la funzione di callback deve essere chiamata con un solo parametro diverso da null.", function()
				{
					let context = { body: '' };
					listener.onMessage(event, context, callback);
					
					//manca qualcosa nel mezzo
					
					expect(callback.callCount).to.equal(1);
					expect(callback.getCall(0).args[0]).to.not.be.null;
					expect(callback.getCall(0).args[1]).to.be.undefined;
				});
        
				it("Nel caso in cui la chiamata al microservizio \\file{Rules} non vada a buon fine, la funzione di callback deve essere chiamata con un solo parametro diverso da null.", function()
				{
					let context = { body: '' };
					listener.onMessage(event, context, callback);
					
					//manca qualcosa nel mezzo
					
					expect(callback.callCount).to.equal(1);
					expect(callback.getCall(0).args[0]).to.not.be.null;
					expect(callback.getCall(0).args[1]).to.be.undefined;
				});
        
				it("Nel caso in cui la chiamata ai metodi di\\file{GuestsDAO} non vada a buon fine, la funzione di callback deve essere chiamata con un solo parametro diverso da null.", function()
				{
					let context = { body: '' };
					listener.onMessage(event, context, callback);
					
					//manca qualcosa nel mezzo
					
					expect(callback.callCount).to.equal(1);
					expect(callback.getCall(0).args[0]).to.not.be.null;
					expect(callback.getCall(0).args[1]).to.be.undefined;
				});
        
				it("Nel caso in cui la chiamata ai metodi di\\file{ConversationsDAO} non vada a buon fine, la funzione di callback deve essere chiamata con un solo parametro diverso da null.", function()
				{
					let context = { body: '' };
					listener.onMessage(event, context, callback);
					
					//manca qualcosa nel mezzo
					
					expect(callback.callCount).to.equal(1);
					expect(callback.getCall(0).args[0]).to.not.be.null;
					expect(callback.getCall(0).args[1]).to.be.undefined;
				});
				
				it("Nel caso in cui non ci siano errori, la funzione di callback deve essere chiamata con due parametri, il primo dei quali uguale a null.", function()
				{
					let context = { body: '' };
					listener.onMessage(event, context, callback);
					
					//manca qualcosa nel mezzo
					
					expect(callback.callCount).to.equal(1);
					expect(callback.getCall(0).args[0]).to.be.null;
					expect(callback.getCall(0).args[1]).to.not.be.null;
				});
      });
    });
  });
});
