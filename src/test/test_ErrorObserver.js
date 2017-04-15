const ErrorObserver = require('../Libs/ErrorObserver');
const chai = require('chai');
const expect = chai.expect;

describe('Libs', function()
{
  describe('ErrorObserver', function()
  {
    obs = new ErrorObserver();
    describe('next', function()
    {
      it('Deve sollevare un\'eccezione se viene chiamato', function()
      {
        expect(obs.next.bind(obs)).to.throw();
      });
    });
  });
});
