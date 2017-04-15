const chai = require('chai');
const expect = chai.expect;
const alr = require('../Back-end/Users/VocalLoginMicrosoftModule');

describe('Back-end', function(done)
{
  describe('Users', function(done)
  {
    describe('VocalLoginMicrosoftModule', function(done)
    {
      describe('addEnrollment', function(done)
      {
        it("Se la chiamata al servizio di Speaker Recognition per aggiungere un Enrollment ritorna uno statusCode diverso da 200, l'ErrorObservable deve notificare l'ErrorObserver chiamando il suo metodo error.");
      });
      describe('createUser', function(done)
      {
        it("Se la chiamata al servizio di Speaker Recognition per creare un utente ritorna uno statusCode diverso da 200, StringObservable deve notificare lo StringObserver chiamando il suo metodo error.");
      });
      describe('deleteUser', function(done)
      {
        it("Se la chiamata al servizio di Speaker Recognition per effettuareil login ritorna uno statusCode diverso da 200, l'ErrorObservable deve notificare l'ErrorObserver chiamando il suo metodo error.");
      });
      describe('doLogin', function(done)
      {
        it("Se la chiamata al servizio di Speaker Recognition per aggiungere un Enrollment ritorna uno statusCode diverso da 200, l'ErrorObservable deve notificare l'ErrorObserver chiamando il suo metodo error.");
      });
      describe('getList', function(done)
      {
        it("Se la chiamata al servizio di Speaker Recognition per ottenere la lista degli utenti ritorna uno statusCode diverso da 200, SRUserObservable deve notificare l'SRUserObserver chiamando il suo metodo error.");
      });
      describe('getUser', function(done)
      {
        it("Se la chiamata al servizio di Speaker Recognition per ottenere un utente ritorna uno statusCode diverso da 200, SRUserObservable deve notificare l'SRUserObserver chiamando il suo metodo error.");
      });
      describe('resetEnrollment', function(done)
      {
        it("Se la chiamata al servizio di Speaker Recognition per resettare un Enrollment ritorna uno statusCode diverso da 200, l'ErrorObservable deve notificare l'ErrorObserver chiamando il suo metodo error.");
      });
    });
  });
});
