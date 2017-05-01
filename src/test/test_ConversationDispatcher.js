const expect = chai.expect;

describe('Client', function(done)
{
  describe('ConversationApp', function(done)
  {
    describe('ConversationDispatcher', function(done)
    {
      describe('dispatch', function(done)
      {
        let dispatcher = new Dispatcher();

			 //it('Nel caso in cui i parametri passati non siano corretti, non deve chiamare il metodo dispatcher.dispatch ma sollevare un\'eccezione');

			 it("Deve notificare tutti gli observer iscritti, passando loro un oggetto composto dai parametri della chiamata ricevuta.", function()
        {
          let obs1 = new Observer();
          let obs2 = new Observer();
          dispatcher.getObservable().subscribe(obs1);
          dispatcher.getObservable().subscribe(obs2);
          dispatcher.dispatch('test', {key: 'val', mauro: 'no'});
          expect(obs1.next.callCount).to.equal(1);
          expect(obs2.next.callCount).to.equal(1);
          expect(obs1.next.getCall(0).args[0]).to.deep.equal({cmd: 'test', params: {key: 'val', mauro: 'no'}});
        });
      });
    });
  });
});
