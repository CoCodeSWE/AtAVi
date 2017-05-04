import State from '../../Client/ApplicationManager/State';
import Application from '../../Client/ApplicationManager/Application';
import {ConversationApp} from '../../Client/Applications/ConversationApp';

const expect = chai.expect;
describe('Integrazione Client', function()
{
  describe('ApplicationManager', function()
  {
    describe('State', function()
    {
      describe('addApp e getApp', function()
      {
        it('Il metodo aggiunge correttamente l’Application passata come parametro e restituisce l’Application a partire dal suo nome passato come parametro.', function()
        {
          let state = new State();
          let conversation = new Application(ConversationApp);
          state.addApp(conversation, 'conversation');
          let temp_app = state.getApp('conversation');
          expect(conversation).to.deep.equal(temp_app);
        });
      });
    });
  });
});
