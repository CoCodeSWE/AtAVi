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
          registry.register.returns(true);
          let app_pckg = { name : 'Conversation', cmdHandler : 'test', setup : 'test', ui : 'test' };
          registry.register('conv', app_pckg);
          expect(app_pckg).to.include.keys('name');
          expect(app_pckg.name).to.not.be.null;
          expect(app_pckg).to.include.keys('cmdHandler');
          expect(app_pckg.cmdHandler).to.not.be.null;
          expect(app_pckg).to.include.keys('setup');
          expect(app_pckg.setup).to.not.be.null;
          expect(app_pckg).to.include.keys('ui');
          expect(app_pckg.ui).to.not.be.null;
        });
      });
      describe('query', function()
      {
        registry.query.returns({ name : 'Conversation', cmdHandler : 'test', setup : 'test', ui : 'test' });
        let app_pckg = { name : 'Conversation', cmdHandler : 'test', setup : 'test', ui : 'test' };
        let pckg_ret = registry.query('conv');
        expect(pckg_ret).to.be.equal(app_pckg);
      });
    });
  });
});
