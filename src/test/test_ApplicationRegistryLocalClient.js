const chai = require('chai');
const expect = chai.expect;
const app_local_reg_client = require('../Client/ApplicationManager/ApplicationLocalRegistryLocalClient');
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
      describe('query e register', function()
      {
        it('Vogliamo testare che sia possibile ottenere/registrare l’\\file{ApplicationPackage} nel registry?????.', function()
        {
          app_local_reg.query.returns( app_pack : { name : 'conv', cmdHandler : '' } );
          registry.register('conv', { name : 'conv', cmdHandler : '' });
          let app = registry.query('conv');
          expect(app).to.be.not.null;
          expect(app.name).to.equal('conv');
        });
      });
    });
  });
});
