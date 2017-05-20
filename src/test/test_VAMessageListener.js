const VAMessageListener = require('../Back-end/Events/VAMessageListener');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const Rx = require('rxjs');
const conversations = require('./stubs/ConversationsDAO');
const guests = require('./stubs/GuestsDAO');
let promise = require('./stubs/RequestPromise');
const context = require('./stubs/LambdaContext');

let callback, listener;
beforeEach(function()
{
	promise = sinon.stub();
	context.succeed = sinon.stub();
	listener = new VAMessageListener(conversations, guests, promise);
});

describe('Back-end', function()
{
  describe('Events', function()
  {
    describe('VAMessageListener', function()
    {		
			describe('onMessage', function()
      {
        it("Nel caso in cui la chiamata al microservizio Notification non vada a buon fine, la funzione di callback deve essere chiamata con un solo parametro diverso da null.", function(done)
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(rules_response)));
					promise.onCall(1).returns(Promise.reject(JSON.stringify(notifications_error)));
					
					callback = function(err, data)
					{
						expect(err).to.be.not.null;
						expect(data).to.be.undefined;
						done();
					}
					
					listener.onMessage(event, context, callback);
				});

				it("Nel caso in cui la chiamata al microservizio Rules non vada a buon fine, la funzione di callback deve essere chiamata con un solo parametro diverso da null.", function(done)
				{
					promise.onCall(0).returns(Promise.reject(JSON.stringify(rules_error)));

					callback = function(err, data)
					{
						expect(err).to.not.be.null;
						expect(data).to.be.undefined;
						done();
					}
					
					listener.onMessage(event, context, callback);
				});

				/*
				it("Nel caso in cui la chiamata ai metodi di GuestsDAO non vada a buon fine, la funzione di callback deve essere chiamata con un solo parametro diverso da null.", function(done)
				{				
					guests.getGuest.yields(null, { 'msg': 'error getting guest' });

					callback = function(err, data)
					{
						expect(err).to.not.be.null;
						expect(data).to.be.undefined;
					}
					
					listener.onMessage(event, context, callback);
				});

				it("Nel caso in cui la chiamata ai metodi di ConversationsDAO non vada a buon fine, la funzione di callback deve essere chiamata con un solo parametro diverso da null.", function(done)
				{
					conversations.addConversation.yields({ 'msg': 'error adding conversation' });
					
					callback = function(err, data)
					{
						expect(err).to.not.be.null;
						expect(data).to.be.undefined;
						done();
					}
					
					listener.onMessage(event, context, callback);
				});
				*/
				
				it("Nel caso in cui non ci siano errori, la funzione di callback deve essere chiamata con due parametri, il primo dei quali uguale a null.", function(done)
				{
					promise.onCall(0).returns(Promise.resolve(JSON.stringify(rules_response)));
					promise.onCall(1).returns(Promise.resolve(JSON.stringify(notifications_response)));
					promise.onCall(2).returns(Promise.resolve('send_to'));
					
					callback = function(err, data)
					{
						expect(err).to.be.null;
						done();
					};
					
					listener.onMessage(event, context, callback);
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

let message = 
{
	action: 'conversation.displayMsgs',
	res:
	{
		text_request: 'request',
		text_response: 'response',
		contexts: 
		[
			{
				name: 'context1',
				parameters: 
				{
					name: 'mou',
					company: 'company',
					request: 'coffee'
				}
			}
		]
	},
	session_id: 'id'
};

let event =
{
	Records:
	[
		{
			Sns:
			{
				Message: JSON.stringify(message),
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
};
