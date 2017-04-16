const chai = require('chai');
const expect = chai.expect;
const alr = require('../Client/ApplicationManager/ApplicationLocalRegistry');

describe('Client', function()
{
  describe('ApplicationManager', function()
  {
    describe('ApplicationLocalRegistry', function()
    {
      describe('register', function()
      {
        it("L'ApplicationPackage passato come parametro deve essere aggiunto correttamente.");
      });
      describe('query', function()
      {
        it("Il -name passato come parametro dev'essere uguale al -name dell'-ApplicationPackage ottenuto.");
      });
      describe('remove', function()
      {
        it("L'-ApplicationPackage passato come parametro deve essere rimosso correttamente.");
      });
    });
  });
});
