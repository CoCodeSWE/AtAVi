const ApiAiVAAdapter = require('../Back-end/VirtualAssistant/ApiAiVAAdapter');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

describe('Back-end', function(done)
{
  describe('VirtualAssistant', function(done)
  {
    describe('ApiAiVAAdapter', function()
    {
			let adapter = new ApiAiVAAdapter(agent);
      describe('query', function()
      {
        it('Nel caso in cui la richiesta HTTP vada a buon fine, la Promise restituita deve essere risolta.', function()
				{

				});
				
        it('Nel caso si verifichi un errore durante la richiesta HTTP, la Promise restituita deve essere respinta.', function()
				{
					
				});
      });
    });
  });
});

var agent =
{
	lang: 'en',
	name: 'conversation',
	token: 'xxxx-xxxx-xxxx-xxxx'	
};

var va_query =
{
	session_id_: '1';
}