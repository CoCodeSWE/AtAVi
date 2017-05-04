import ApplicationLocalRegistry from '../../Client/ApplicationManager/ApplicationLocalRegistry';

const expect = chai.expect;

describe('Client', function()
{
  describe('ApplicationManager', function()
  {
    describe('ApplicationLocalRegistry', function()
    {
      describe("register, query", function()
      {
        it("L'\\{ApplicationPackage} passato come parametro al metodo register dev'essere inserito con name uguale al parametro passato. \\ L'\\{ApplicationPackage} inserito dev'essere ritornato tramite il metodo query. ", function()
        {
          let registry = new ApplicationLocalRegistry();
          registry.register('conv', { name:'Conversation' });
          let app_pckg = registry.query('conv');
          expect(app_pckg).to.not.be.undefined;
          expect(app_pckg.name).to.equal('Conversation');
        });
      });
      describe('register, remove', function()
      {
        it("L'\\{ApplicationPackage} passato come parametro al metodo register dev'essere inserito con name uguale al parametro passato. \\ L'\\{ApplicationPackage} inserito dev'essere eliminato tramite il metodo remove.", function()
        {
          let registry = new ApplicationLocalRegistry();
          let name_app_pack = 'ConversationApp';
          registry.register('conv', { name:'Conversation' });
          registry.remove(name_app_pack);
          expect(registry.query(name_app_pack)).to.be.undefined;
        });
      });
    });
  });
});
