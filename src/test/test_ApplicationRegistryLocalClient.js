const chai = require('chai');
const expect = chai.expect;
const app_local_reg_client = require('../Client/ApplicationManager/ApplicationRegistryLocalClient');
const app_local_reg = require('stubs/ApplicationLocalRegistry');

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
        it('Vogliamo testare che venga aggiunto correttamente l’\\file{ApplicationPackage} passato come parametro, se è un \\file{ApplicationPackage} completo.', function()
        {
          let app_pckg = { name : 'Conversation', cmdHandler : 'test', setup : 'test', ui : 'test' };
          let bool = registry.register('conv', app_pckg);
          let call = registry.register.getCall(0);
          expect(call.args[1]).to.include.keys('name');
          expect(call.args[1].name).to.not.be.null;
          expect(call.args[1]).to.include.keys('cmdHandler');
          expect(call.args[1].cmdHandler).to.not.be.null;
          expect(call.args[1]).to.include.keys('setup');
          expect(call.args[1].setup).to.not.be.null;
          expect(call.args[1]).to.include.keys('ui');
          expect(call.args[1].ui).to.not.be.null;
          expect(bool).to.be.true;
        });
      });
      describe('query', function()
      {
        it('Vogliamo testare che venga ritornato correttamente l’\\file{ApplicationPackage} a partire dal suo nome passato come parametro.', function()
        {
          app_local_reg.query.returns({ name : 'Conversation', cmdHandler : 'test', setup : 'test', ui : 'test' });
          let app_pckg = { name : 'Conversation', cmdHandler : 'test', setup : 'test', ui : 'test' };
          let pckg_ret = registry.query('conv');
          expect(pckg_ret).to.be.deep.equal(app_pckg);
        });
      });
    });
  });
});
