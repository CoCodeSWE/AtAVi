const VAService = require('../Back-end/VirtualAssistant/VAService');
const chai = require('chai');
const expect = chai.expect;
const Rx = require('rxjs/Rx');
const sinon = require('sinon');
const va = require('./stubs/VAModule');
const agents = require('./stubs/AgentsDAO');
const context = require('./stubs/LambdaContext');

beforeEach(function()
{
	context.succeed = sinon.stub();
});

describe('Back-end', function()
{
	describe('VirtualAssistant', function()
	{
		describe('VAService', function()
		{
      let service = new VAService(agents, va);

      let req_body =
      {
        app: "test",
        query:
        {
          text: "hi",
          session_id: "1",
          data:
          {
            key: "value",
            index: "value"
          }
        }
      };

      let res_body =
      {
        action: 'action',
        res:
        {
          contexts: [],
          data:
          {
            key: "value",
            index: "value"
          },
          text_request: "richiesta",
          text_response: "risposta"
        },
        session_id: "1",
        statusCode: 200
      };

      let error =
      {
        statusCode: 412,
				message: 'Errore'
      };
			
      agents.getAgent.returns('01011');
			describe('query', function(done)
			{
				it('Se la richiesta HTTP ad api.ai va a buon fine allora lo status code della risposta deve essere uguale a 200.', function()
        {
					agents.getAgent.returns(Rx.Observable.empty());
          va.query.returns(Promise.resolve(res_body));
          service.query({ body: JSON.stringify(req_body) }, context);
          
					setTimeout(function()
					{
						expect(context.succeed.callCount).to.equal(1);
						expect(agents.getAgent.callCount).to.equal(1);
						expect(agents.getAgent.calledWith('test'));
						let result = context.succeed.getCall(0).args[0];
						expect(result).to.not.be.null;
						expect(result.statusCode).to.equal(200);
					});
        });
				it('Se la chiamata al modulo VAModule genera un\'errore, lo status code della risposta deve essere uguale al codice di errore ricevuto.', function()
        {
					agents.getAgent.returns(Rx.Observable.throw(new Error()));
          va.query.returns(Promise.resolve(error));
          service.query({ body: JSON.stringify(req_body) }, context);
          
					setTimeout(function()
					{
						expect(context.succeed.callCount).to.equal(1);
						let result = context.succeed.getCall(0).args[0];
						expect(result).to.not.be.null;
						expect(result.statusCode).to.equal(412);
					});
				});
			});
		});
	});
});
