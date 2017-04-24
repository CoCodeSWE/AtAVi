const AdministrationWebhookService = require('../Back-end/AdministrationWebhookService');
const chai = require('chai');
const expect = chai.expect;
const jwt = require('./stubs/jwt');


beforeEach(function()
{
  service = new AdministrationWebhookService(jwt);
});

describe('Back-end', function(done)
{
  describe('AdministrationWebhookService', function(done)
  {
    describe('webhook', function(done)
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
            "originalRequest":
            {
                "source": "client",
                "data":
                {
                    "token": "Token"
                }
            }
        }
     `};
      it('La risposte dovrebbe avere il campo statusCode impostato a 200 nel caso in cui venga passato un JWT corretto.', function(done)
      {
        jwt.verify.returns(1);
        service.webhook(ev, { success: function(res) { expect(res.statusCode).to.equal(200); done(); }});
      });

      it('La risposta dovrebbe avere il campo statusCode impostato a 403 nel caso in cui la richiesta contenga un JWT non valido.', function(done)
      {
        jwt.verify.throws();
        service.webhook(ev, { success: function(res) { expect(res.statusCode).to.equal(403); done(); }});
      });

    });
  });
});
