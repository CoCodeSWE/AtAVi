const ApiAiVAAdapter = require('../Back-end/VirtualAssistant/ApiAiVAAdapter');
const chai = require('chai');
const expect = chai.expect;
const RequestPromise = require('./stubs/request-promise');
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
          request_promise.returns(Promise.resolve(JSON.stringify(response)));
          adapter.query(query)
            .then(function()
            {
              done();
            }).catch(done);
        });

        it('Nel caso si verifichi un errore durante la richiesta HTTP, la Promise restituita deve essere respinta', function()
        {
          //sarebbero da aggiungere i singoli casi (status code, data.statusCode, ecc)
          request_promise.returns(Promise.resolve(JSON.stringify(error)));
          adapter.query(query).then(done).catch(function(){done();});
        });
      });
    });
  });
});

var response =
{
  action: "test",
  res:
  {
    contexts:
    {

    },
    data:
    {

    },
    text_request: "request",
    text_response: "response"
  },
  session_id: "1"
};

var error =
{
  statusCode: 400,
  message: "Bad Request"
};

var query =
{
  data: {},
  session_id: "1",
  text: "request"
}
