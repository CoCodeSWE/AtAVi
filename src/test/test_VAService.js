const VAService = require('../Back-end/VirtualAssistant/VAService');
const chai = require('chai');

describe('Back-end', function()
{
	describe('VirtualAssistant', function()
	{
		describe('VAService', function()
		{
			describe('query', function()
			{
				it('Se la richiesta HTTP ad api.ai va a buon fine allora status code, result.fulfillment.data.status e status.code sono uguali a 200.');
				it('Se la richiesta HTTP ad api.ai genera un errore, nel caso in cui status code oppure status.code sia diverso da 200, il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.');
				it('Se la richiesta HTTP ad api.ai genera un errore, nel caso in cui result.fulfillment.data.status sia impostato ad un valore diverso da 200, il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è uguale allo status di result.fulfillment.data.status.');
			});
		});
	});
});