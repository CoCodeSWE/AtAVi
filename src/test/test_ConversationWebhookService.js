const AdministrationWebhookService = require('../Back-end/AdministrationWebhookService');
const chai = require('chai');
const expect = chai.expect;
const conv_DAO = require('./stubs/ConversationsDAO');
const guests_DAO = require('./stubs/GuestsDAO');
const users_DAO = require('./stubs/UsersDAO');

describe('Back-end', function()
{
  describe('AdministrationWebhookService', function()
  {
    describe('webhook', function()
    {
      let ev =
      {
        body:`
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
                "action": "greetings",
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
     `};
      it("La risposta deve avere il campo -name del context uguale a 'admin' nel caso in cui l'utente sia stato riconosciuto come possibile amministratore.", function()
      {
        users_DAO.getUsername.returns(RxObservable.of({ name : "Mauro Carlin", username : "mou"}));
        let call = context.succeed.getCall(0);
        expect(context.succeed.calledOnce).to.be.true;
        expect(call.args[0]).not.to.be.null;
        let resp =
        {
          "context":
          {
            "context_name" : "admin",
            "name" : "Mauro Carlin",
            "username" : "Mou"
          }
        }
        expect(call.args[0]).to.be.deep.equal({ body : JSON.stringfy(resp)});
      });
      it("La risposta deve avere il campo -name del context uguale a 'welcome' nel caso in cui l'utente sia stato riconosciuto come ospite che ha avuto interazioni passate con il sistema.", function()
      {
        guests_DAO.getGuest.returns(RxObservable.of({ name : "Mauro Carlin", username : "mou", company : "Google"}));
        let call = context.succeed.getCall(0);
        expect(context.succeed.calledOnce).to.be.true;
        expect(call.args[0]).not.to.be.null;
        let resp =
        {
          "context":
          {
            "context_name":"welcome",
            "guest_name":"Mauro Carlin",
            "company":"Google",
            "member_name":"Stefano Dindo"
          }
        }
        expect(call.args[0]).to.be.deep.equal({ body : JSON.stringfy(resp)});
      });
    });
  });
});
