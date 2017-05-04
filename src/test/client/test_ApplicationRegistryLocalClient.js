import ApplicationRegistryLocalClient from '../../Client/ApplicationManager/ApplicationRegistryLocalClient';
import {app_local_reg} from '../stubs/ApplicationLocalRegistry';
const expect = chai.expect;

let next, error, complete, registry;
beforeEach(function()
{
	next = sinon.stub();
	error = sinon.stub();
	complete = sinon.stub();
	registry = new ApplicationRegistryLocalClient(app_local_reg);
});

describe('Client', function()
{
  describe('ApplicationManager', function()
  {
    describe('ApplicationRegistryLocalClient', function()
    {
      describe('register', function()
      {
        it("Nel caso in cui una applicazione venga registrata correttamente, l'Observable ritornato deve chiamare il metodo complete dell'Observer iscritto.", function()
        {
          let app_pckg = { name : 'Conversation', cmdHandler : 'test', setup : 'test', ui : 'test' };

          registry.register('conv', app_pckg).subscribe(
          {
						next: next,
						error: error,
						complete: complete
					});

          expect(next.callCount).to.equal(0);
          expect(error.callCount).to.equal(0);
          expect(complete.callCount).to.equal(1);
        });
				
				it("Nel caso in cui si provi ad inserire un Package parziale, l'Observable deve chiamare il metodo error dell'Observer iscritto", function()
				{
					let app_pckg = { name: 'Conversation' };
					
					registry.register('conv', app_pckg).subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					expect(next.callCount).to.equal(0);
          expect(error.callCount).to.equal(1);
          expect(complete.callCount).to.equal(0);
				});
      });
			
      describe('query', function()
      {
        it("Nel caso in cui l'interrogazione del ApplicationLocalRegistry vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta.", function()
        {
					let conv_app = { name : 'Conversation', cmdHandler : 'test', setup : 'test', ui : 'test' };
					app_local_reg.query.returns(conv_app);
					
					registry.query('conv').subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
          
					expect(next.callCount).to.equal(1);
					expect(next.getCall(0).args[0]).to.have.deep.property('name', 'Conversation');
          expect(error.callCount).to.equal(0);
					expect(complete.callCount).to.equal(1);
        });
      });
    });
  });
});
