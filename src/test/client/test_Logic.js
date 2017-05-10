import Logic from '../../Client/Logic/Logic';

const expect = chai.expect;
let logic;

beforeEach(function()
{
	logic = new Logic();
});

describe('Client', function()
{
	describe('Logic', function()
	{
		describe('Logic', function()
		{
			describe('sendData', function()
			{
				it('Se la promessa viene soddisfatta (fulfill) allora il metodo deve notificare gli Observer iscritti.');

				it('Se la promessa viene respinta (reject) allora il metodo deve notificare di tale errore gli Observer iscritti.');
			});
		});
	});
});
