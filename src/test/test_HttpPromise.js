const HttpPromise = require('../Client/Logic/HttpPromise');
const chai = require('chai');

describe('Client', function()
{
  describe('Logic', function()
  {
    describe('HttpPromise', function()
    {
      describe('then', function()
      {
        it('Se la richiesta va a buon fine, viene chiamata la funzione di callback \file{fulfill}.',function()
        {
          let httppromise = new HttpPromise('method','headers','[]',{});
          let fulfill = function();
          let reject = function();
          let call = httppromise.then(fulfill, reject);
          expect(call.args[0].calledOnce).to.be.true;
        });

        it('Se la richiesta fallisce, viene chiamata la funzione di callback \file{reject}.',function()
        {
          let httppromise = new HttpPromise('method','headers','[]',{});
          let fulfill = function();
          let reject = function();
          let call = httppromise.then(fulfill, reject);
          expect(call.args[1].calledOnce).to.be.true;
        });
      });
    });
  });
});
