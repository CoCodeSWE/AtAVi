const VAMessageListener = require('../Back-end/Events/VAMessageListener');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const Rx = require('rxjs');
const conversations = require('./stubs/ConversationsDAO');
const guests = require('./stubs/GuestsDAO');
const promise = require('./stubs/RequestPromise');

let callback;
beforeEach(function()
{
	callback = sinon.stub();
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
					action: 'abbiamo finito'
				},
				MessageId: 2,
				Subject: 'subject',
				Timestamp: new Date().toISOString()
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
        it("Nel caso in cui la chiamata al microservizio \\file{Notifications} non vada a buon fine, la funzione di callback deve essere chiamata con un solo parametro diverso da null.", function()
				{
					let context = { body: '' };

					promise.onCall(0).returns(Promise.resolve(JSON.stringify(rules_response)));
					promise.onCall(1).returns(Promise.reject(JSON.stringify(notifications_error)));
					conversations.addMessage.returns(Rx.Observable.throw(new Error()));
					listener.onMessage(event, context, callback);

					expect(callback.callCount).to.above(1); // le chiamate a questo microservizio sono almeno una!
					expect(callback.getCall(0).args[0]).to.not.be.null;
					expect(callback.getCall(0).args[1]).to.be.undefined;
				});

				it("Nel caso in cui la chiamata al microservizio \\file{Rules} non vada a buon fine, la funzione di callback deve essere chiamata con un solo parametro diverso da null.", function()
				{
					let context = { body: '' };

					promise.onCall(0).returns(Promise.reject(JSON.stringify(rules_error)));

					listener.onMessage(event, context, callback);

					expect(callback.callCount).to.above(1); // le chiamate a questo microservizio sono almeno una!
					expect(callback.getCall(0).args[0]).to.not.be.null;
					expect(callback.getCall(0).args[1]).to.be.undefined;
				});

				it("Nel caso in cui la chiamata ai metodi di \\file{GuestsDAO} non vada a buon fine, la funzione di callback deve essere chiamata con un solo parametro diverso da null.", function(done)
				{
					let context = { body: '' };
					listener.onMessage(event, context, callback);
					done();
					guests.getGuest.yield(null, { 'msg': 'error getting guest' });

					expect(callback.callCount).to.above(1);
					expect(callback.getCall(0).args[0]).to.not.be.null;
					expect(callback.getCall(0).args[1]).to.be.undefined;
				});

				it("Nel caso in cui la chiamata ai metodi di\\file{ConversationsDAO} non vada a buon fine, la funzione di callback deve essere chiamata con un solo parametro diverso da null.", function(done)
				{
					let context = { body: '' };
					listener.onMessage(event, context, callback);
					done();
					conversations.addConversation.yield({ 'msg': 'error adding conversation' });

					expect(callback.callCount).to.above(1);
					expect(callback.getCall(0).args[0]).to.not.be.null;
					expect(callback.getCall(0).args[1]).to.be.undefined;
				});

				it("Nel caso in cui non ci siano errori, la funzione di callback deve essere chiamata con due parametri, il primo dei quali uguale a null.", function(done)
				{
					let context = { body: '' };

					promise.onCall(0).returns(Promise.resolve(JSON.stringify(rules_response)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify(notifications_response)));
					listener.onMessage(event, context, callback);
					done();
					guests.getGuest.yield(null, { 'type': 'example' });
					conversations.addConversation.yield(null, {});

					expect(callback.callCount).to.equal(1);
					expect(callback.getCall(0).args[0]).to.be.null;
					expect(callback.getCall(0).args[1]).to.not.be.null;
				});
      });
    });
  });
});

let notifications_response =
{
	statusCode: 200,
	'message': 'success'
};

let rules_response =
{
	statusCode: 200,
	rules : [
	{
		'enabled': true,
		'id': 5,
		'name': 'oh bella',
		'targets': [
		{
			'company': 'co.code',
			'member': 'mauro',
			'name': 'mauro',
		}],
		'task':
		{
			'params':
			{
				'par1': 'Object',
				'par2': 'Object',
			},
			'task': 'richiesta'
		}
	}]
};

let notifications_error =
{
	statusCode: 500,
	'message': 'Errore'
};

let rules_error =
{
	statusCode: 500,
	'message': 'Errore'
};
