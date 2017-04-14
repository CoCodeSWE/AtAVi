const ObserverAdapter = require('../Libs/ObserverAdapter');
const chai = require('chai');
const expect = chai.expect;

let obs;
beforeEach(function(){
  obs = new ObserverAdapter();
});

describe('Libs', function(done)
{
  describe('ErrorObserver', function(done){
    describe('complete', function(done)
    {
      it('Deve chiamare complete_cb');
      it('Non deve chiamare complete_cb se l\'observer è in pausa');
      it('Deve chiamare complete_cb dopo che l\'observer è stato ripreso se mentre era in pausa il metodo è stato chiamato');
    });

    describe('error', function(done)
    {
      it('Deve chiamare error_cb');
      it('Non deve chiamare error_cb se l\'observer è in pausa');
      it('Deve chiamare error_cb dopo che l\'observer è stato ripreso se mentre era in pausa il metodo è stato chiamato');
    });

    describe('next', function(done)
    {
      it('Deve chiamare next_cb, inoltrandogli il parametro ricevuto, se l\'observer non è in pausa', function(done)
      {
        obs.onNext(success(done));
        obs.next('data');
      });
      it('Non deve chiamare next_cb se è in pausa', function(done)
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
        obs.next('function called');
        obs.resume();
        obs.onNext(success(done));
        obs.next('data');
      });
    });
  });
})

function error(done)
{
  return function(data){done(data);}
}

function success(done)
{
  return function(data){done();}
}

function continueTest(done)
{
  return function(data){return;}
}
