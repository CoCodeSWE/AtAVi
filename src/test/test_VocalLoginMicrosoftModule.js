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
          promise.returns(Promise.reject(
            "error" : {
              "code" : "InternalServerError",
              "message" : "SpeakerInvalid"
            }
          ));
          microsoft.addEnrollment().subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          expect(next.countCall).to.equal(0);
          expect(complete.countCall).to.equal(0);
          expect(error.countCall).to.equal(1);
        });
      });
      describe('createUser', function(done)
      {
        it("Se la chiamata al servizio di Speaker Recognition per creare un utente ritorna uno statusCode diverso da 200, StringObservable deve notificare lo StringObserver chiamando il suo metodo error.", function()
        {
          promise.returns(Promise.reject(
            "error" : {
              "code" : "InternalServerError",
              "message" : "SpeakerInvalid"
            }
          ));
          microsoft.createUser().subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          expect(next.countCall).to.equal(0);
          expect(complete.countCall).to.equal(0);
          expect(error.countCall).to.equal(1);
        });
      });
      describe('deleteUser', function(done)
      {
        it("Se la chiamata al servizio di Speaker Recognition per eliminare un utente ritorna uno statusCode diverso da 200, l'ErrorObservable deve notificare l'ErrorObserver chiamando il suo metodo error.", function()
        {
          promise.returns(Promise.reject(
            "error" : {
              "code" : "InternalServerError",
              "message" : "SpeakerInvalid"
            }
          ));
          microsoft.deleteUser().subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          expect(next.countCall).to.equal(0);
          expect(complete.countCall).to.equal(0);
          expect(error.countCall).to.equal(1);
        });
      });
      describe('doLogin', function(done)
      {
        it("Se la chiamata al servizio di Speaker Recognition per effettuare il login ritorna un oggetto con campo 'result' pari a 'Reject', l'ErrorObservable deve notificare l'ErrorObserver chiamando il suo metodo error.", function()
        {
          promise.returns(Promise.reject(
            { "result" : "Reject" }
          ));
          microsoft.doLogin().subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          expect(next.countCall).to.equal(0);
          expect(complete.countCall).to.equal(0);
          expect(error.countCall).to.equal(1);
        });
      });
      describe('getList', function(done)
      {
        it("Se la chiamata al servizio di Speaker Recognition per ottenere la lista degli utenti ritorna uno statusCode diverso da 200, SRUserObservable deve notificare l'SRUserObserver chiamando il suo metodo error.", function()
        {
          promise.returns(Promise.reject(
            "error" : {
              "code" : "InternalServerError",
              "message" : "SpeakerInvalid"
            }
          ));
          microsoft.getList().subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          expect(next.countCall).to.equal(0);
          expect(complete.countCall).to.equal(0);
          expect(error.countCall).to.equal(1);
        });
      });
      describe('getUser', function(done)
      {
        it("Se la chiamata al servizio di Speaker Recognition per ottenere un utente ritorna uno statusCode diverso da 200, SRUserObservable deve notificare l'SRUserObserver chiamando il suo metodo error.", function()
        {
          promise.returns(Promise.reject(
            "error" : {
              "code" : "InternalServerError",
              "message" : "SpeakerInvalid"
            }
          ));
          microsoft.getUser().subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          expect(next.countCall).to.equal(0);
          expect(complete.countCall).to.equal(0);
          expect(error.countCall).to.equal(1);
        });
      });
      describe('resetEnrollment', function(done)
      {
        it("Se la chiamata al servizio di Speaker Recognition per resettare un Enrollment ritorna uno statusCode diverso da 200, l'ErrorObservable deve notificare l'ErrorObserver chiamando il suo metodo error.", function()
        {
          promise.returns(Promise.reject(
            "error" : {
              "code" : "InternalServerError",
              "message" : "SpeakerInvalid"
            }
          ));
          microsoft.resetEnrollment().subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          expect(next.countCall).to.equal(0);
          expect(complete.countCall).to.equal(0);
          expect(error.countCall).to.equal(1);
        });
      });
    });
  });
});
