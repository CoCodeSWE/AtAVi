import ApplicationLocalRegistry from '../../Client/ApplicationManager/ApplicationLocalRegistry';

const expect = chai.expect;

let registry;
beforeEach(function()
{
	registry = new ApplicationLocalRegistry();
});

describe('Client', function()
{
  describe('ApplicationManager', function()
  {
    describe('ApplicationLocalRegistry', function()
    {
      describe("register, query", function()
      {
        it("L' ApplicationPackage passato come parametro al metodo register dev'essere inserito con name uguale al parametro passato. L'ApplicationPackage inserito dev'essere ritornato tramite il metodo query. ", function()
        {
					let register_pkg = { name:'Conversation' };
          registry.register('conv', register_pkg);
					
					let app_pckg = registry.query('conv');
          expect(app_pckg).to.deep.equal(register_pkg);
        });
      });
      describe('register, remove', function()
      {
        it("L'ApplicationPackage passato come parametro al metodo register dev'essere inserito con name uguale al parametro passato. L'ApplicationPackage inserito dev'essere eliminato tramite il metodo remove.", function()
        {
          let name_app_pack = 'ConversationApp';
          registry.register(name_app_pack, { name:'Conversation' });
					
          registry.remove(name_app_pack);
          expect(registry.query(name_app_pack)).to.be.undefined;
        });
      });
    });
  });
});
