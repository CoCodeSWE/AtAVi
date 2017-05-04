import State from '../../Client/ApplicationManager/State';
import application from '../stubs/Application';

describe('Client', function()
{
  describe('ApplicationManager', function()
  {
    describe('State', function()
    {
      describe('addApp e getApp', function()
      {
        it('Il metodo aggiunge correttamente l’Application passata come parametro e restituisce l’Application a partire dal suo nome passato come parametro.', function()
        {
          state = new State();
          state.addApp(application, 'app');
          let temp_app = state.getApp('app');
          expect(application).to.equal(temp_app);
        });
      });
    });
  });
});
