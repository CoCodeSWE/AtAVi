const chai = require('chai');
const expect = chai.expect;
const app_local_reg_client = require('../Client/ApplicationManager/ApplicationRegistryLocalClient');
const app_local_reg = require('./stubs/ApplicationLocalRegistry');

beforeEach(function()
{
  registry = new app_local_reg_client(app_local_reg);
});

describe('Client', function()
{
  describe('ApplicationManager', function()
  {
    describe('ApplicationRegistryLocalClient', function()
    {
      describe('register', function()
      {
        it("Nel caso in cui una applicazione venga registrata corretamente, l'\\file{Observable} ritornato deve chiamare il metodo \file{complete} dell'\file{Observer} iscritto.", function()
        {
          let app_pckg = { name : 'Conversation', cmdHandler : 'test', setup : 'test', ui : 'test' };

          let bool = registry.register('conv', app_pckg).subscribe(
          {
						next: next,
						error: error,
						complete: complete
					});
          expect(next.callCount).to.equal(0);
          expect(error.callCount).to.equal(0);
          expect(complete.callCount).to.equal(1);
          expect(bool).to.be.true;
        });
      });
      describe('query', function()
      {
        it("Nel caso in cui l'interrogazione del ApplicationLocalRegistry vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta.", function()
        {
          app_local_reg.query.returns({ name : 'Conversation', cmdHandler : 'test', setup : 'test', ui : 'test' });
          let app_pckg = {name : 'Conversation', cmdHandler : 'test', setup : 'test', ui : 'test' };
          let pckg_ret = registry.query('conv');
          expect(pckg_ret).to.be.deep.equal(app_pckg);
        });
      });
    });
  });
});
