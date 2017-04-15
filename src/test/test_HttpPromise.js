const Manager = require('../Client/Logic/HttpPromise');
const chai = require('chai');

describe('Client', function()
{
  describe('Logic', function()
  {
    describe('HttpPromise', function()
    {
      describe('then', function()
      {
        it('Se la richiesta va a buon fine, viene chiamata la funzione di callback \file{fulfill}.');
        it('Se la richiesta fallisce, viene chiamata la funzione di callback \file{reject}.');
      });
    });
  });
});
