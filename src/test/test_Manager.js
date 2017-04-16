const Manager = require('../Client/ApplicationManager/Manager');
const chai = require('chai');

describe('Client', function()
{
  describe('ApplicationManager', function()
  {
    describe('Manager', function()
    {
      describe('runApplication', function()
      {
        it('Nel caso in cui l’applicazione è presente all\'interno di \file{State}, non viene interrogato il Client.');
        it('Nel caso in cui l’applicazione non è presente all\'interno di \file{State}, viene interrogato il Client per ottenerla e la vecchia applicazione viene salvata nello \file{State}.');
      });

      describe('setFrame', function()
      {
        it('Deve chiamare \file{appendChild} sul parametro passato al metodo per poter mostrare l’interfaccia utente.');
      });
    });
  });
});
