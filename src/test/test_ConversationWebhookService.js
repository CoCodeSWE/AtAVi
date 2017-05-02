const ConversationWebhookService = require('../Back-end/ConversationWebhookService/ConversationWebhookService');
const chai = require('chai');
const expect = chai.expect;
const Rx = require('rxjs/Rx');
const conv_DAO = require('./stubs/ConversationsDAO');
const guests_DAO = require('./stubs/GuestsDAO');
const users_DAO = require('./stubs/UsersDAO');
const sinon = require('sinon');

let context = require('./stubs/LambdaContext');
let service;
beforeEach(function()
{
  context.succeed = sinon.stub();
  service = new ConversationWebhookService(conv_DAO, guests_DAO, users_DAO);
});

describe('Back-end', function()
{
  describe('ConversationWebhookService', function()
  {
    describe('webhook', function()
    {
      it("La risposta deve avere il campo name del context uguale a 'admin' nel caso in cui l'utente sia stato riconosciuto come possibile amministratore.", function()
      {
        body.result.action = 'user.check';
        let ev = {body: JSON.stringify(body)};
        users_DAO.getUserList.returns(Rx.Observable.of({ name : "Mauro Carlin", username : "mou"}));
        service.webhook(ev, context);
        expect(context.succeed.callCount).to.equal(1);
        let call = context.succeed.getCall(0);
        expect(call.args[0]).not.to.be.null;
        //expect(JSON.parse(call.args[0].body).contextOut[0]).to.have.deep.property('name', 'admin');
      });
      it("La risposta deve avere il campo name del context uguale a 'welcome' nel caso in cui l'utente sia stato riconosciuto come ospite che ha avuto interazioni passate con il sistema.", function()
      {
        body.result.action = 'guest.check';
        let ev = {body: JSON.stringify(body)};
        guests_DAO.getGuestList.returns(Rx.Observable.of([{ name : "Mauro Carlin", username : "mou", company : "Google"}]));
        service.webhook(ev, context);
        expect(context.succeed.callCount).to.equal(1);
        let call = context.succeed.getCall(0);
        expect(call.args[0]).not.to.be.null;
        expect(JSON.parse(call.args[0].body).contextOut[0]).to.have.deep.property('name', 'welcome');
      });
    });
  });
});

let body =
{
  "lang": "en",
  "timestamp": "",
  "sessionId": "",
  "result":
  {
      "parameters":
      {
          "city": "Rome",
          "name": "Ana"
      },
      "contexts": [],
      "resolvedQuery": "my name is Ana and I live in Rome",
      "source": "agent",
      "score": 1.0,
      "speech": "",
      "fulfillment":
      {
          "messages": [
              {
                  "speech": "Hi Ana! Nice to meet you!",
                  "type": 0
              }
          ],
          "speech": "Hi Ana! Nice to meet you!"
      },
      "actionIncomplete": false,
      "action": "user.check",
      "metadata":
      {
          "intentId": "9f41ef7c-82fa-42a7-9a30-49a93e2c14d0",
          "webhookForSlotFillingUsed": "false",
          "intentName": "greetings",
          "webhookUsed": "true"
      }
  },
  "id": "",
  "originalRequest": ""
}
