const ObserverAdapter = require('../Libs/ObserverAdapter');
const chai = require('chai');
const expect = chai.expect;

let obs;
beforeEach(function()
{
  obs = new ObserverAdapter();
});

describe('Libs', function(done)
{
  describe('ErrorObserver', function(done)
	{
    describe('complete', function(done)
    {
      it('Deve chiamare complete_cb', function(done)
			{
				obs.onComplete(success(done));
				obs.complete();
			});
      
			it('Non deve chiamare complete_cb se l\'observer è in pausa', function(done)
			{
				obs.onComplete(error(done));
				obs.pause();
				obs.complete('Function called');
				done();
			});
      
			it('Deve chiamare complete_cb dopo che l\'observer è stato ripreso se, mentre era in pausa, il metodo è stato chiamato', function(done)
			{
				obs.onComplete(continueTest(done));
				obs.complete();
				obs.pause();
				obs.onComplete(error(done));
				obs.complete();
				obs.onComplete(success(done));
				obs.resume();
			});
    });

    describe('error', function(done)
    {
      it('Deve chiamare error_cb', function(done) 
			{
				let err = new Error('Errore');
				obs.onError(success(done, err));
				obs.error(err);
			});
			
      it('Non deve chiamare error_cb se l\'observer è in pausa', function(done)
			{
				obs.onError(error(done));
				obs.pause();
				obs.error('Function called');
				done();
			});
			
      it('Deve chiamare error_cb dopo che l\'observer è stato ripreso se, mentre era in pausa, il metodo è stato chiamato', function(done)
			{
				let err = new Error('Errore');
				obs.onError(continueTest(done));
				obs.error(err);
				obs.pause();
				obs.onError(error(done));
				obs.error(err);
				obs.onError(success(done, err));
				obs.resume();
			});
    });

    describe('next', function(done)
    {
      it('Deve chiamare next_cb, inoltrandogli il parametro ricevuto, se l\'observer non è in pausa', function(done)
      {
        obs.onNext(success(done, 'data'));
        obs.next('data');
      });
			
      it('Non deve chiamare next_cb se l\'observer è in pausa', function(done)
      {
        obs.onNext(error(done));
        obs.pause();
        obs.next('Function called');
        done();
      });
			
      it('Deve chiamare next_cb, inoltrandogli il parametro ricevuto, dopo che l\'observer ha ripreso', function(done)
      {
        obs.onNext(continueTest(done));
        obs.next('data');
        obs.pause();
        obs.onNext(error(done));
        obs.next('Function called');
        obs.resume();
        obs.onNext(success(done, 'data'));
        obs.next('data');
      });
    });
  });
})

function error(done)
{
  return function(data) {done(data);}
}

function success(done, data)
{
  return function(d) 
	{
		expect(d).to.equal(data);
		done();
	}
}

function continueTest(done)
{
  return function(data) {return;}
}
