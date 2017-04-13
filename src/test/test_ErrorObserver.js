const ErrorObserver = require('../Libs/ErrorObserver');
const chai = require('chai');
const expect = chai.expect;

describe('ErrorObserver suite', function(){
  let obs = new ErrorObserver();
  it('Should throw when next is called', function(){
    expect(obs.next).to.throw();
  });
});
