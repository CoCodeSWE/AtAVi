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
      describe("L'\\{ApplicationPackage} passato come parametro al metodo register dev'essere inserito con name uguale al parametro passato. \\ L'\\{ApplicationPackage} inserito dev'essere ritornato tramite il metodo query. ", function()
      {
        it("L'\\{ApplicationPackage} passato come parametro deve essere ritornato correttamente, dopo essere stato inserito con un determinato nome.", function()
        {
          registry.register('conv', { name:'Conversation' });
          let app_pckg = registry.query('conv');
          expect(app_pckg.name).to.not.be.null;
          expect(app_pckg.name).to.equal('Conversation');
        }
      });
      describe('register e remove', function()
      {
        it("L'\\{ApplicationPackage} passato come parametro al metodo register dev'essere inserito con name uguale al parametro passato. \\ L'\\{ApplicationPackage} inserito dev'essere eliminato tramite il metodo remove."),function()
        {
          let name_app_pack = 'ConversationApp';
          registry.register('conv', { name:'Conversation' });
          registry.remove(name_app_pack);
          expect(registry.query(name_app_pack)).to.be.null;
        }
      });
    });
  });
});
