const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const vocal = require('../Back-end/Users/VocalLoginMicrosoftModule');
const promise = require ('./stubs/RequestPromise');

let microsoft_login, next, error, complete;
beforeEach(function()
{
  next = sinon.stub();
  error = sinon.stub();
  complete = sinon.stub();
  microsoft_login = new vocal( { key : 'test', min_confindence : 0 }, promise);
});

describe('Back-end', function()
{
  describe('Users', function()
  {
    describe('VocalLoginMicrosoftModule', function()
    {
      describe('addEnrollment', function()
      {
        it("Se la chiamata al servizio di Speaker Recognition per aggiungere un Enrollment ritorna uno statusCode diverso da 200, l'ErrorObservable deve notificare l'ErrorObserver chiamando il suo metodo error.", function(done)
        {
          promise.returns(Promise.reject(
          {
            "error" :
            {
              "code" : "InternalServerError",
              "message" : "SpeakerInvalid"
            }
          }));
          microsoft_login.addEnrollment().subscribe(
          {
            next: next,
						error: error,
						complete: complete
          });
          setTimeout(function()
					{	
						expect(next.callCount).to.equal(0);
						expect(complete.callCount).to.equal(0);
						expect(error.callCount).to.equal(1);
						done();
					});
				});
      });
      describe('createUser', function()
      {
        it("Se la chiamata al servizio di Speaker Recognition per creare un utente ritorna uno statusCode diverso da 200, StringObservable deve notificare lo StringObserver chiamando il suo metodo error.", function(done)
        {
          promise.returns(Promise.reject(
          {
            "error" :
            {
              "code" : "InternalServerError",
              "message" : "SpeakerInvalid"
            }
          }));
          microsoft_login.createUser().subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          setTimeout(function()
					{	
						expect(next.callCount).to.equal(0);
						expect(complete.callCount).to.equal(0);
						expect(error.callCount).to.equal(1);
						done();
					})
        });
      });
      describe('deleteUser', function()
      {
        it("Se la chiamata al servizio di Speaker Recognition per eliminare un utente ritorna uno statusCode diverso da 200, l'ErrorObservable deve notificare l'ErrorObserver chiamando il suo metodo error.", function(done)
        {
          promise.returns(Promise.reject(
          {
            "error" :
            {
              "code" : "InternalServerError",
              "message" : "SpeakerInvalid"
            }
          }));
          microsoft_login.deleteUser().subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          setTimeout(function()
					{	
						expect(next.callCount).to.equal(0);
						expect(complete.callCount).to.equal(0);
						expect(error.callCount).to.equal(1);
						done();
					})
        });
      });
      describe('doLogin', function()
      {
        it("Se la chiamata al servizio di Speaker Recognition per effettuare il login ritorna un oggetto con campo 'result' pari a 'Reject', l'ErrorObservable deve notificare l'ErrorObserver chiamando il suo metodo error.", function(done)
        {
          promise.returns(Promise.reject({ "result" : "Reject" }));
          microsoft_login.doLogin().subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          setTimeout(function()
					{	
						expect(next.callCount).to.equal(0);
						expect(complete.callCount).to.equal(0);
						expect(error.callCount).to.equal(1);
						done();
					})
        });
      });
      describe('getList', function()
      {
        it("Se la chiamata al servizio di Speaker Recognition per ottenere la lista degli utenti ritorna uno statusCode diverso da 200, SRUserObservable deve notificare l'SRUserObserver chiamando il suo metodo error.", function(done)
        {
          promise.returns(Promise.reject(
          {
            "error" :
            {
              "code" : "InternalServerError",
              "message" : "SpeakerInvalid"
            }
          }));
          microsoft_login.getList().subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          setTimeout(function()
					{	
						expect(next.callCount).to.equal(0);
						expect(complete.callCount).to.equal(0);
						expect(error.callCount).to.equal(1);
						done();
					})
        });
      });
      describe('getUser', function()
      {
        it("Se la chiamata al servizio di Speaker Recognition per ottenere un utente ritorna uno statusCode diverso da 200, SRUserObservable deve notificare l'SRUserObserver chiamando il suo metodo error.", function(done)
        {
          promise.returns(Promise.reject(
            {
            "error" :
            {
              "code" : "InternalServerError",
              "message" : "SpeakerInvalid"
            }
          }));
          microsoft_login.getUser().subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          setTimeout(function()
					{	
						expect(next.callCount).to.equal(0);
						expect(complete.callCount).to.equal(0);
						expect(error.callCount).to.equal(1);
						done();
					})
        });
      });
      describe('resetEnrollments', function()
      {
        it("Se la chiamata al servizio di Speaker Recognition per resettare un Enrollment ritorna uno statusCode diverso da 200, l'ErrorObservable deve notificare l'ErrorObserver chiamando il suo metodo error.", function(done)
        {
          promise.returns(Promise.reject(
          {
            "error" :
            {
              "code" : "InternalServerError",
              "message" : "SpeakerInvalid"
            }
          }));
          microsoft_login.resetEnrollments().subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          setTimeout(function()
					{	
						expect(next.callCount).to.equal(0);
						expect(complete.callCount).to.equal(0);
						expect(error.callCount).to.equal(1);
						done();
					})
        });
      });
    });
  });
});
