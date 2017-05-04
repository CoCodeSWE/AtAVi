import ApplicationRegistryLocalClient from '../../Client/ApplicationManager/ApplicationRegistryLocalClient';
import {app_local_reg} from '../stubs/ApplicationLocalRegistry';

const expect = chai.expect;

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
          let registry = new ApplicationRegistryLocalClient(app_local_reg);

          let app_pckg = { name : 'Conversation', cmdHandler : 'test', setup : 'test', ui : 'test' };

          let error = sinon.stub(), next = sinon.stub(), complete = sinon.stub();

          let bool = registry.register('conv', app_pckg).subscribe(
          {
						next: next,
						error: error,
						complete: complete
					});
          expect(next.callCount).to.equal(0);
          expect(error.callCount).to.equal(0);
          expect(complete.callCount).to.equal(1);
          expect(bool).to.be.true;
        });
      });
      describe('query', function()
      {
        it("Nel caso in cui l'interrogazione del ApplicationLocalRegistry vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta.", function()
        {
          let registry = new ApplicationRegistryLocalClient(app_local_reg);

          app_local_reg.query.returns({ name : 'Conversation', cmdHandler : 'test', setup : 'test', ui : 'test' });
          let app_pckg = {name : 'Conversation', cmdHandler : 'test', setup : 'test', ui : 'test' };
          let pckg_ret = registry.query('conv');
          expect(pckg_ret).to.equal(app_pckg);
        });
      });
    });
  });
});
