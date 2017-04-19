const Manager = require('../Client/ApplicationManager/Manager');
const chai = require('chai');
const ApplicationRegistryClient = require ('./stubs/ApplicationRegistryClient')
const HTMLElement = require(); //????????????????????????????
const State = require ('./stubs/State');

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
          NON SO QUALE APPLICAZIONE RICERCARE D: prima inserisco e poi controllo

        };

        it('Nel caso in cui l’applicazione non sia presente all\'interno di \file{State}, viene interrogato il Client per ottenerla e la vecchia applicazione viene salvata nello \file{State}.');
      });

      describe('setFrame', function()
      {
        it('Deve chiamare \file{appendChild} sul parametro passato al metodo per poter mostrare l’interfaccia utente.', function()
        {
          manager = new Manager(ApplicationRegistryClient, 'element');
          let call = manager.setFrame.getCall(0);
          expect(manager.setFrame.calledOnce).to.be.true;
          expect(call.args[0]).to.not.be.null;
          expect(call.args[0].appendChild.calledOnce).to.be.true;
        });
      });
    });
  });
});
