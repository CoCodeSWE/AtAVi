const State = require('../Client/ApplicationManager/State');
const chai = require('chai');
const Application = require('./stubs/Application');

describe('Client', function()
{
  describe('ApplicationManager', function()
  {
    describe('State', function()
    {
      describe('addApp e getApp', function()
      {
        it('Il metodo aggiunge correttamente l’\file{Application} passata come parametro e restituisce l’\file{Application} a partire dal suo nome passato come parametro.', function()
        {

          state = new State();
          state.addApp(Application, 'app');
          let temp_app = state.getApp('app');
          expect(Application).to.deep.equal(temp_app);

        });
      });
    });
  });
});
