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
        it('Nel caso in cui l’applicazione non sia presente all\'interno di State, viene interrogato il Client per ottenerla e la vecchia applicazione viene salvata nello State.',function()
        {
          let conversation = new Application(ConversationApp);
          manager.registry_client.register('conversation', ConversationApp).subscribe(
          {
            next : function(data){ console.log(data); },
            error : function(err){ console.log(err); },
            complete : function()
            {
              manager.runApplication('conversation', 'cmd', {}, 'conversation');
              expect(manager.application_name).to.equal('conversation');
              expect(manager.ui).to.equal(manager.application.ui);
              expect(manager.application.name).to.equal(conversation.name);
            }
          });
        });
      });
    });
  });
});
