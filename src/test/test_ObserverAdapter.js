const ObserverAdapter = require('../Libs/ObserverAdapter');
const chai = require('chai');
const expect = chai.expect;

let obs;
beforeEach(function(){
  obs = new ObserverAdapter();
});

describe('ErrorObserver suite', function(done){
  it('Should call complete callback if complete is called');
  it('Should call error callback if error is called');
  it('Should notify when not paused', function(done){
    obs.onNext(success(done));
    obs.next('data');
  });
  it('Should not notify when paused', function(done){
    obs.onNext(error(done));
    obs.pause();
    obs.next('Function called');
    done();
  });
  it('Should notify after being resumed', function(done){
    obs.onNext(continueTest(done));
    obs.next('data');
    obs.pause();
    obs.onNext(error(done));
    obs.next('function called');
    obs.resume();
    obs.onNext(success(done));
    obs.next('data');
  });
  it('Should call error callback after being resumed if error was called');
  it('Should call complete after being resumed if complete was called');
});

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
