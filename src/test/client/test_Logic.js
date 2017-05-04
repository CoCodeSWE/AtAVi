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
				it('Se la promessa viene soddisfatta (fulfill) allora il metodo deve notificare gli Observer iscritti.', function(done)
				{
					HttpPromise.returns(Promise.resolve('audio'));
					logic.sendData('audio');
					expect(logic.subject.next.callCount).to.equal(1);
					expect(logic.subject.next.getCall[0].args[0]).to.equal('audio');
					expect(logic.subject.error.callCount).to.equal(0);
				});

				it('Se la promessa viene respinta (reject) allora il metodo deve notificare di tale errore gli Observer iscritti.', function(done)
				{
					HttpPromise.returns(Promise.reject('error'));

					logic.sendData('audio');
					expect(logic.subject.next.callCount).to.equal(0);
					expect(logic.subject.error.callCount).to.equal(1);
					expect(logic.subject.next.getCall[0].args[0]).to.equal('error');
				});
			});
		});
	});
});
