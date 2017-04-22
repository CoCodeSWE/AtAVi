const VAService = require('../Back-end/VirtualAssistant/VAService');
const chai = require('chai');
const va = require('./stubs/VAModule');
const agents = require('./stubs/AgentsDAO');
const context = require('./stubs/LambdaContext');

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
      }

      agents.getAgent.returns('01011');
      va.query.returns(res_body);
			
			describe('query', function()
			{
				it('Se la richiesta HTTP ad api.ai va a buon fine allora lo status code, result.fulfillment.data.status e status.code sono uguali a 200.', function()
        {
          service.query({ body: JSON.stringify(req_body) }, context);
          expect(agents.getAgent.callCount).to.equal(1);
          expect(agents.getAgent.calledWith('test'));
					expect(context.succeed.callCount).to.equal(1);
          let result = context.succeed.getCall(0).args[0];
          expect(result).to.not.be.null;
          expect(result.statusCode).to.equal(200);
        });
				
				it('Se la richiesta HTTP ad api.ai genera un errore, nel caso in cui lo status code oppure status.code sia diverso da 200, il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è impostato a 500.', function()
        {
          res_body.statusCode = 500;
          service.query({ body: JSON.stringify(req_body) }, context);
					expect(agents.getAgent.callCount).to.equal(1);
					expect(agents.getAgent.calledWith('test'));
					expect(context.succeed.callCount).to.equal(1);
					let result = context.succeed.getCall(0).args[0];
          expect(result).to.not.be.null;
          expect(result.statusCode).to.equal(500)
        });
				
				it('Se la richiesta HTTP ad api.ai genera un errore, nel caso in cui result.fulfillment.data.status sia impostato ad un valore diverso da 200, il metodo deve chiamare il metodo succeed del context con un parametro LambdaResponse il quale campo statusCode è uguale allo status di result.fulfillment.data.status.', function()
        {
          res_body.statusCode = 1234; //codice che non corrisponde a niente, per testare che sia uguale
          service.query({ body: JSON.stringify(req_body) }, context);
					expect(agents.getAgent.callCount).to.equal(1);
					expect(agents.getAgent.calledWith('test'));
					expect(context.succeed.callCount).to.equal(1);
					let result = context.succeed.getCall(0).args[0];
          expect(result).to.not.be.null;
          expect(result.statusCode).to.equal(1234);
        });
			});
		});
	});
});
