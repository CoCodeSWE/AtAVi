const Manager = require('../Client/ApplicationManager/Manager');
const chai = require('chai');
const ApplicationRegistryClient = require ('./stubs/ApplicationRegistryClient')
const State = require ('./stubs/State');
const Application = require('./stubs/Application');
const HTMLElement = require('./stubs/HTMLElement');

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
          state.addApp(Application, 'app');
          let appltemp = state.getApp('app');
          expect(Application).to.deep.equal(appltemp);
          expect(registry_client.query.calledOnce).to.not.be.true;
        };

        it('Nel caso in cui l’applicazione non sia presente all\'interno di \file{State}, viene interrogato il Client per ottenerla e la vecchia applicazione viene salvata nello \file{State}.',function()
        {
          //testo con l'app nonEsistente che si suppone non esista
          let appltemp = state.getApp('nonEsistente');
          expect(appltemp).to.be.equal(null);
          expect(state.addApp.calledOnce).to.be.true;
          expect(registry_client.query.calledOnce).to.be.true;

        });

      });

      describe('setFrame', function()
      {
        it('Deve chiamare \file{appendChild} sul parametro passato al metodo per poter mostrare l’interfaccia utente.', function()
        {
          manager = new Manager(ApplicationRegistryClient, HTMLElement);
          let call = manager.setFrame.getCall(0);
          expect(manager.setFrame.calledOnce).to.be.true;
          expect(call.args[0]).to.not.be.null;
          expect(call.args[0].appendChild.calledOnce).to.be.true;
        });
      });
    });
  });
});
