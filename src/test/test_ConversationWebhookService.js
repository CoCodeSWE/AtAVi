const AdministrationWebhookService = require('../Back-end/AdministrationWebhookService');
const chai = require('chai');
const expect = chai.expect;

describe('Back-end', function(done)
{
  describe('AdministrationWebhookService', function(done)
  {
    describe('webhook', function(done)
    {
      it("La risposta dovrebbe avere il campo -name del context uguale a 'admin' nel caso in cui l'utente sia stato riconosciuto come possibile amministratore.");
      it("La risposta dovrebbe avere il campo -name del context uguale a 'welcome' nel caso in cui l'utente sia stato riconosciuto come ospite che ha avuto interazioni passate con il sistema.");
    });
  });
});
