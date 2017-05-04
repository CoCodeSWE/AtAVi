import ApplicationRegistryLocalClient from '../../Client/ApplicationManager/ApplicationRegistryLocalClient';
import ApplicationLocalRegistry from '../../Client/ApplicationManager/ApplicationLocalRegistry';
import {ConversationApp} from '../../Client/Applications/ConversationApp';
const expect = chai.expect;

let next, error, complete, registry;
beforeEach(function()
{
	/*next = function(){};
	error = function(){};
	complete = function(){};*/
	registry = new ApplicationRegistryLocalClient(new ApplicationLocalRegistry());
});

describe('Integrazione Client', function(done)
{
  describe('ApplicationManager', function(done)
  {
    describe('ApplicationRegistryLocalClient', function(done)
    {
      describe('register', function(done)
      {
        it("Nel caso in cui una applicazione venga registrata correttamente, l'Observable ritornato deve chiamare il metodo complete dell'Observer iscritto.", function(done)
        {
          registry.register('conversation', ConversationApp).subscribe(
          {
						next : function(data) { done(data); },
						error : function(err) { done(err); },
						complete : done()
					});

        });

				it("Nel caso in cui si provi ad inserire un Package parziale, l'Observable deve chiamare il metodo error dell'Observer iscritto", function(done)
				{
					let app_pckg = { name: 'Conversation' };

					registry.register('conv', app_pckg).subscribe(
					{
						next: next,
						error: function()
						{
							expect(next.callCount).to.equal(0);
		          expect(error.callCount).to.equal(1);
		          expect(complete.callCount).to.equal(0);
							done();
						},
						complete: complete
					});
				});
      });

      describe('query', function(done)
      {
        it("Nel caso in cui l'interrogazione del ApplicationLocalRegistry vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta.", function(done)
        {

					registry.register('conversation', ConversationApp);

					registry.query('conversation').subscribe(
					{
						next : next,
						error: error,
						complete : function(){
							expect(next.callCount).to.equal(1);
							expect(next.getCall(0).args[0]).to.have.deep.property('name', 'conversation');
							expect(error.callCount).to.equal(0);
							expect(complete.callCount).to.equal(1);
							done();
						}
					});


        });
      });
    });
  });
});
