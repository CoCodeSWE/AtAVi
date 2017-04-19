const chai = require('chai');
const expect = chai.expect;
const vocal = require('../Back-end/Users/VocalLoginMicrosoftModule');
const promise = require ('stubs/RequestPromise')

let microsoft_login, next, error, complete;
beforeEach(function()
{
  next = sinon.stub();
  error = sinon.stub();
  complete = sinon.stub();
  microsoft_login = new vocal( { key : 'test', min_confindence : 0 }, promise);
});

describe('Back-end', function(done)
{
  describe('Users', function(done)
  {
    describe('VocalLoginMicrosoftModule', function(done)
    {
      describe('addEnrollment', function(done)
      {
        it("Se la chiamata al servizio di Speaker Recognition per aggiungere un Enrollment ritorna uno statusCode diverso da 200, l'ErrorObservable deve notificare l'ErrorObserver chiamando il suo metodo error.", function()
        {
          microsoft_login.addEnrollment().subscribe(
          {
            next: (data) => {done(data);},
            error: (err) => {done();},
            complete: () => {done('complete called');}
          }
          promise.catch.yield(handleError);

          microsoft.addEnrollment().subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          expect(error.countCall).to.equal(1);
        });
      });
      describe('createUser', function(done)
      {
        it("Se la chiamata al servizio di Speaker Recognition per creare un utente ritorna uno statusCode diverso da 200, StringObservable deve notificare lo StringObserver chiamando il suo metodo error.", function()
        {
          microsoft.createUser().subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          expect(error.countCall).to.equal(1);
        });
      });
      describe('deleteUser', function(done)
      {
        it("Se la chiamata al servizio di Speaker Recognition per effettuareil login ritorna uno statusCode diverso da 200, l'ErrorObservable deve notificare l'ErrorObserver chiamando il suo metodo error.", function()
        {
          microsoft.deleteUser().subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          expect(error.countCall).to.equal(1);
        });
      });
      describe('doLogin', function(done)
      {
        it("Se la chiamata al servizio di Speaker Recognition per aggiungere un Enrollment ritorna uno statusCode diverso da 200, l'ErrorObservable deve notificare l'ErrorObserver chiamando il suo metodo error.", function()
        {
          microsoft.doLogin().subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          expect(error.countCall).to.equal(1);
        });
      });
      describe('getList', function(done)
      {
        it("Se la chiamata al servizio di Speaker Recognition per ottenere la lista degli utenti ritorna uno statusCode diverso da 200, SRUserObservable deve notificare l'SRUserObserver chiamando il suo metodo error.", function()
        {
          microsoft.getList().subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          expect(error.countCall).to.equal(1);
        });
      });
      describe('getUser', function(done)
      {
        it("Se la chiamata al servizio di Speaker Recognition per ottenere un utente ritorna uno statusCode diverso da 200, SRUserObservable deve notificare l'SRUserObserver chiamando il suo metodo error.", function()
        {
          microsoft.getUser().subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          expect(error.countCall).to.equal(1);
        });
      });
      describe('resetEnrollment', function(done)
      {
        it("Se la chiamata al servizio di Speaker Recognition per resettare un Enrollment ritorna uno statusCode diverso da 200, l'ErrorObservable deve notificare l'ErrorObserver chiamando il suo metodo error.", function()
        {
          microsoft.resetEnrollment().subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          expect(error.countCall).to.equal(1);
        });
      });
    });
  });
});
