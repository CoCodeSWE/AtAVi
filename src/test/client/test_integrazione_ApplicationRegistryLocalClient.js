import ApplicationRegistryLocalClient from '../../Client/ApplicationManager/ApplicationRegistryLocalClient';
import ApplicationLocalRegistry from '../../Client/ApplicationManager/ApplicationLocalRegistry';
import {ConversationApp} from '../../Client/Applications/ConversationApp';
const expect = chai.expect;

let registry = new ApplicationRegistryLocalClient(new ApplicationLocalRegistry());

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
						next: function(data) 
						{
							done(data); 
						},
						
						error: function(err)
						{ 
							done(err); 
						},
						
						complete : done
					});
        });

				it("Nel caso in cui si provi ad inserire un Package parziale, l'Observable deve chiamare il metodo error dell'Observer iscritto", function(done)
				{
					let pkg_parziale = { name: 'conversation' };
					registry.register('conversation', pkg_parziale).subscribe(
					{
						next: function(data)
						{
							done(data)
						},
						
						error: function(err)
						{
							console.log(err);
							done();
						},
						
						complete: function()
						{
							done('Called complete')
						}
					});
				});
      });

      describe('query', function(done)
      {
        it("Nel caso in cui l'interrogazione del ApplicationLocalRegistry vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta.", function(done)
        {
					//Il pacchetto è stato inserito nei precedenti test (il primo)
					
					let pkg;	// Conterrà il pacchetto notificato dal next
					registry.query('conversation').subscribe(
					{
						next : function(data)
						{
							pkg = data;
						},
						
						error: function(err)
						{
							done(err);
						},
						
						complete : function()
						{
							expect(pkg).to.deep.equal(ConversationApp);
							done();
						}
					});
        });
      });
    });
  });
});
