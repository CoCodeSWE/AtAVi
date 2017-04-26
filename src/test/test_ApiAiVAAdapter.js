const ApiAiVAAdapter = require('../Back-end/VirtualAssistant/ApiAiVAAdapter');
const chai = require('chai');
const expect = chai.expect;
const RequestPromise = require('./stubs/RequestPromise');
const Promise = require('bluebird');
let adapter;

beforeEach(function()
{
  adapter = new ApiAiVAAdapter('agent', RequestPromise);
});

describe('Back-end', function(done)
{
  describe('VirtualAssistant', function(done)
  {
    describe('ApiAiVAAdapter', function()
    {
      describe('query', function()
      {
        it('Nel caso in cui la richiesta HTTP vada a buon fine, la Promise restituita deve essere risolta con i dati relativi alla risposta dell\'assistente virtuale', function(done)
        {
          RequestPromise.returns(Promise.resolve(response));
          adapter.query(query).then(function(data)
					{
						done();
					})
					.catch(done);
        });

        it('Nel caso si verifichi un errore durante la richiesta HTTP, la Promise restituita deve essere respinta', function(done)
        {
          //sarebbero da aggiungere i singoli casi (status code, data.statusCode, ecc)
          RequestPromise.returns(Promise.resolve(error));
          adapter.query(query).then(done).catch(function(err){done();});
        });
      });
    });
  });
});

var response =
{
  'id': 'b340a1f7-abee-4e13-9bdd-5e8938a48b7d',
  'timestamp': '2017-02-09T15:38:26.548Z',
  'lang': 'en',
  'result': {
    'source': 'agent',
    'resolvedQuery': 'my name is Sam and I live in Paris',
    'action': 'greetings',
    'actionIncomplete': false,
    'parameters': {},
    'contexts': [],
    'metadata': {
      'intentId': '9f41ef7c-82fa-42a7-9a30-49a93e2c14d0',
      'webhookUsed': 'false',
      'webhookForSlotFillingUsed': 'false',
      'intentName': 'greetings'
    },
    'fulfillment': {
      'speech': 'Hi Sam! Nice to meet you!',
      'messages': [
        {
          'type': 0,
          'speech': 'Hi Sam! Nice to meet you!'
        }
      ]
    },
    'score': 1
  },
  'status': {
    'code': 200,
    'errorType': 'success'
  },
  'sessionId': '4b6a6779-b8ea-4094-b2ed-a302ba201815'
}

var error =
{
  statusCode: 400,
  message: 'Bad Request'
};

var query =
{
  data: {},
  session_id: '1',
  text: 'request'
}
