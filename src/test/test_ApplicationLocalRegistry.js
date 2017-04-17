const chai = require('chai');
const expect = chai.expect;
const application_local_registry = require('../Client/ApplicationManager/ApplicationLocalRegistry');

beforeEach(function()
{
  registry = new application_local_registry();
});

describe('Client', function()
{
  describe('ApplicationManager', function()
  {
    describe('ApplicationLocalRegistry', function()
    {
      describe('register e query', function()
      {
        it("DA SCRIVERE", function()
        {
          registry.register('conv', { name:'Conversation' });
          let app_pckg = registry.query('conv');
          expect(app_pckg.name).to.not.be.null;
          expect(app_pckg.name).to.equal('Conversation');
        }
      });
      describe(' ???register???? e remove', function()
      {
        it("L'*ApplicationPackage passato come parametro deve essere rimosso correttamente."),function()
        {
          let name_app_pack = 'ConversationApp';
          registry.register('conv', { name:'Conversation' });
          registry.remove(name_app_pack);
          expect(registry.query(name_app_pack)).to.be.null;
        }DA SISTEMARE
      });
    });
  });
});
