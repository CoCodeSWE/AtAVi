const ApiAiVAAdapter = require('../Back-end/VirtualAssistant/ApiAiVAAdapter');
const chai = require('chai');
const expect = chai.expect;

describe('ApiAiVAAdapter', function()
{
  describe('query', function()
  {
    it('Nel caso in cui la richiesta HTTP vada a buon fine, la Promise restituita deve essere risolta');
    it('Nel caso si verifichi un errore durante la richiesta HTTP, la Promise restituita deve essere respinta');
  });
});
