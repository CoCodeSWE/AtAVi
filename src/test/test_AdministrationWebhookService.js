const AdministrationWebhookService = require('../Back-end/AdministrationWebhookService');
const chai = require('chai');
const expect = chai.expect;

describe('AdministrationWebhookService', function(done)
{
  describe('webhook', function(done)
  {
    it('La risposte dovrebbe avere il campo statusCode impostato a 200 nel caso in cui venga passato un JWT corretto');
    it('La risposta dovrebbe avere il campo statusCode impostato a 403 nel caso in cui la richiesta contenga un JWT non valido');
  });
});
