const ObserverAdapter = require('../Libs/ObserverAdapter');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

let obs;
let success, error, complete;

beforeEach(function()
{
  success = sinon.stub();
  error = sinon.stub();
  complete = sinon.stub();
  obs = new ObserverAdapter();
});

describe('Libs', function()
{
  describe('ObserverAdapter', function()
	{
    describe('complete', function()
    {
      it('Deve chiamare complete_cb', function()
			{
				obs.onComplete(success);
				obs.complete();
        expect(success.callCount, "il callback di complete non è stato chiamato esattamente una volta.").to.equal(1);
			});

			it('Non deve chiamare complete_cb se l\'observer è in pausa', function()
			{
				obs.onComplete(success);
				obs.pause();
				obs.complete();
				expect(success.callCount).to.equal(0);
			});

			it('Deve chiamare complete_cb dopo che l\'observer è stato ripreso se, mentre era in pausa, il metodo è stato chiamato', function()
			{
				obs.onComplete(success);
				obs.complete();
        expect(success.callCount).to.equal(1);
				obs.pause();
        obs.complete();
        expect(success.callCount).to.equal(1);
				obs.resume();
        expect(success.callCount).to.equal(2);
			});
    });

    describe('error', function()
    {
      it('Deve chiamare error_cb', function()
			{
				let err = new Error('Errore');
				obs.onError(success);
				obs.error(err);
        let call = success.getCall(0);

        expect(success.callCount).to.equal(1);
        expect(call.args[0]).to.equal(err);
			});

      it('Non deve chiamare error_cb se l\'observer è in pausa', function()
			{
				obs.onError(success);
				obs.pause();
				obs.error('errore');
        expect(success.callCount).to.equal(0);
			});

      it('Deve chiamare error_cb dopo che l\'observer è stato ripreso se, mentre era in pausa, il metodo è stato chiamato', function()
			{
				let err = new Error('Errore');
				obs.onError(success);
				obs.error(err);
        expect(success.callCount).to.equal(1);
				obs.pause();
				obs.error(err);
        expect(success.callCount).to.equal(1);
				obs.resume();
				expect(success.callCount).to.equal(2);
        let call = success.getCall(1);
        expect(call.args[0]).to.equal(err);
			});
    });

    describe('next', function(done)
    {
      it('Deve chiamare next_cb, inoltrandogli il parametro ricevuto, se l\'observer non è in pausa', function()
      {
        obs.onNext(success);
        obs.next('data');
        expect(success.callCount).to.equal(1);
        let call = success.getCall(0);
        expect(call.args[0]).to.equal('data');
      });

      it('Non deve chiamare next_cb se l\'observer è in pausa', function()
      {
        obs.onNext(success);
        obs.pause();
        obs.next('Function called');
        expect(success.callCount).to.equal(0);
      });

      it('Deve chiamare next_cb, inoltrandogli il parametro ricevuto, dopo che l\'observer ha ripreso', function()
      {
        obs.onNext(success);
        obs.next('data');
        expect(success.callCount).to.equal(1);
        obs.pause();
        obs.next('data');
        expect(success.callCount).to.equal(1);
        obs.resume();
        expect(success.callCount).to.equal(1);
        obs.next('other data');
        expect(success.callCount).to.equal(2);
      });
    });
  });
})
