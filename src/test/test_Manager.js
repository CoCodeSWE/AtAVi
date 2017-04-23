const Manager = require('../Client/ApplicationManager/Manager');
const chai = require('chai');
const applicationRegistryClient = require ('./stubs/ApplicationRegistryClient')
const state = require ('./stubs/State');
const Application = require('./stubs/Application');
const HTMLElement = require('./stubs/HTMLElement');

let manager;

beforeEach(function()
{
  manager = new Manager(ApplicationRegistryClient, HTMLElement);
});

describe('Client', function()
{
  describe('ApplicationManager', function()
  {
    describe('Manager', function()
    {
      describe('runApplication', function()
      {
        it('Nel caso in cui l’applicazione sia presente all\'interno di \file{State}, non viene interrogato il Client.',function()
        {

          //testo con applicazione che ho aggiunto io
          state.getApp.returns(Application);
          manager.runApplication('app', 'cmd', {});
          expect(applicationRegistryClient.query.callCount).to.equal(0);
        };

        it('Nel caso in cui l’applicazione non sia presente all\'interno di \file{State}, viene interrogato il Client per ottenerla e la vecchia applicazione viene salvata nello \file{State}.',function()
        {
          state.getApp.returns(null);
          applicationRegistryClient.returns(Promise.resolve({cmdHandler: 'cmdHandler', name: 'name', setup: 'setup', ui: 'ui'}));
          manager.runApplication('app', 'cmd', {});
          expect(applicationRegistryClient.query.callCount).to.equal(1);
          manager.runApplication('app2', 'cmd', {});
          expect(state.addApp.callCount).to.equal(1);

        });

      });

      describe('setFrame', function()
      {
        it('Deve chiamare \file{appendChild} sul parametro passato al metodo per poter mostrare l’interfaccia utente.', function()
        {
          let call = manager.setFrame.getCall(0);
          expect(manager.setFrame.callCount).to.equal(1);
          expect(call.args[0]).to.not.be.null;
          expect(call.args[0].appendChild.callCount).to.equal(1);
        });
      });
    });
  });
});
