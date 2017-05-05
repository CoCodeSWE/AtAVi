import Manager from '../../Client/ApplicationManager/Manager';
import {applicationRegistryClient} from '../../Client/ApplicationManager/ApplicationRegistryLocalClient';
import {state} from '../../Client/ApplicationManager/State';
import Application from '../../Client/ApplicationManager/Application';
import {ConversationApp} from '../../Client/Applications/ConversationApp';

const expect = chai.expect;

let manager;
beforeEach(function()
{
  manager = new Manager(applicationRegistryClient, '');
});

describe('Integrazione Client', function()
{
  describe('ApplicationManager', function()
  {
    describe('Manager', function()
    {
      describe('runApplication', function()
      {
        it('Nel caso in cui l’applicazione sia presente all\'interno di State, non viene interrogato il Client.',function()
        {
          let conversation = new Application(ConversationApp);
					manager.state.addApp(conversation, 'conversation');
          manager.runApplication('conversation', 'cmd', {}, 'conversation');
          expect(applicationRegistryClient.query.callCount).to.equal(0);
        });

        it('Nel caso in cui l’applicazione non sia presente all\'interno di State, viene interrogato il Client per ottenerla e la vecchia applicazione viene salvata nello State.',function()
        {
					manager.state.getApp = sinon.stub();
					manager.state.addApp = sinon.stub();
          manager.state.getApp.returns(undefined);
          applicationRegistryClient.query.returns(Rx.Observable.of({cmdHandler: 'cmdHandler', name: 'name', setup: 'setup', ui: 'ui', libs: ['0', '1', '2']}));
          manager.runApplication('app1', 'cmd', {}, 'name');
          expect(applicationRegistryClient.query.callCount).to.equal(1);
          manager.runApplication('app2', 'cmd', {}, 'name');
					expect(manager.state.addApp.callCount).to.equal(1);
        });
      });

      describe('setFrame', function()
      {
        it('Deve chiamare appendChild sul parametro passato al metodo per poter mostrare l’interfaccia utente.', function()
        {
					var new_frame =
					{
						appendChild: sinon.stub(),
						removeChild: sinon.stub(),
						innerHTML: 'frame'
					};

          manager.setFrame(new_frame);
					expect(new_frame.appendChild.callCount).to.equal(1);

        });
      });
    });
  });
});
