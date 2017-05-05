import Manager from '../../Client/ApplicationManager/Manager';
import ApplicationRegistryLocalClient from '../../Client/ApplicationManager/ApplicationRegistryLocalClient';
import ApplicationLocalRegistry from '../../Client/ApplicationManager/ApplicationLocalRegistry';
import Application from '../../Client/ApplicationManager/Application';
import {ConversationApp} from '../../Client/Applications/ConversationApp';

const expect = chai.expect;

let manager, html;
beforeEach(function()
{
  html =
  {
    appendChild : function(){},
    removeChild : function(){},
    innerHTML : '<!DOCTYPE html><html><head></head><body></body></html>'
  }
  manager = new Manager(new ApplicationRegistryLocalClient(new ApplicationLocalRegistry()), html);
});

describe('Integrazione Client', function()
{
  describe('ApplicationManager', function()
  {
    describe('Manager', function()
    {
      describe('runApplication', function()
      {
        /*it('Nel caso in cui l’applicazione sia presente all\'interno di State, non viene interrogato il Client.',function()
        {
          let conversation = new Application(ConversationApp);
					manager.state.addApp(conversation, 'conversation');
          manager.runApplication('conversation', 'cmd', {}, 'conversation');
          expect(manager.registry_client.query.callCount).to.equal(0);
        });*/

        it('Nel caso in cui l’applicazione non sia presente all\'interno di State, viene interrogato il Client per ottenerla e la vecchia applicazione viene salvata nello State.',function()
        {
          let conversation = new Application(ConversationApp);
					manager.registry_client.register('conversation', ConversationApp);
          manager.runApplication('conversation', 'COMANDO', {}, 'conversation');
          expect(manager.application).to.deep.equal(conversation);
					//expect(manager.state.addApp.callCount).to.equal(1);
        });
      });

      describe('setFrame', function()
      {
        it('Deve chiamare appendChild sul parametro passato al metodo per poter mostrare l’interfaccia utente.', function()
        {
					var new_frame =
					{
						appendChild: function(){},
						removeChild: function(){},
						innerHTML: 'frame'
					};

          manager.setFrame(new_frame);
					expect(manager.frame).to.deep.equal(new_frame);

        });
      });
    });
  });
});
