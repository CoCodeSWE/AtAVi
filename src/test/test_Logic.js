const expect = chai.expect;

describe('Client', function()
{
	describe('Logic', function()
	{
		describe('Logic', function()
		{
			describe('sendData', function()
			{
				let logic = new Logic();
				it('Se la promessa viene soddisfatta (fulfill) allora il metodo deve notificare gli Observer iscritti.', function()
				{
					HttpPromise.returns(Promise.resolve('audio'));

					let obs1 = new Observer();
					let obs2 = new Observer();

					logic.getObservable().subscribe(obs1);
					logic.getObservable().subscribe(obs2);
					logic.sendData('audio');

					expect(obs1.next.callCount).to.equal(1);
					expect(obs1.next.getCall[0].args[0]).to.equal('audio');
					expect(obs2.next.callCount).to.equal(1);
					expect(obs2.next.getCall[0].args[0]).to.equal('audio');
					expect(obs1.error.callCount).to.equal(0);
					expect(obs2.error.callCount).to.equal(0);
				});

				it('Se la promessa viene respinta (reject) allora il metodo deve notificare di tale errore gli Observer iscritti.', function()
				{
					HttpPromise.returns(Promise.reject('error'));

					let obs1 = new Observer();
					let obs2 = new Observer();

					logic.getObservable().subscribe(obs1);
					logic.getObservable().subscribe(obs2);
					logic.sendData('audio');

					expect(obs1.error.callCount).to.equal(1);
					expect(obs1.error.getCall[0].args[0]).to.equal('error');
					expect(obs2.error.callCount).to.equal(1);
					expect(obs2.error.getCall[0].args[0]).to.equal('error');
					expect(obs1.next.callCount).to.equal(0);
					expect(obs2.next.callCount).to.equal(0);
				});
			});
		});
	});
});
