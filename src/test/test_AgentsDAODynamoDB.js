
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const dao = require('../Back-end/VirtualAssistant/AgentsDAODynamoDB');
const dynamo_client = require('./stubs/DynamoDB');

var mock_agent = {lang:'en', name:'mock_name', token:'mock_token'};

let next, error, complete;
beforeEach(function()
{
	next = sinon.stub();
	error = sinon.stub();
	complete = sinon.stub();
});

describe('Back-end', function(done)
{
  describe('Agents', function(done)
  {
    describe('AgentsDAODynamoDB', function(done){
      let agents = new dao(dynamo_client);
      describe('addAgent', function(done)
      {
		    it("Nel caso in cui un agente di api.ai non venga aggiunto a causa di un'errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'observer iscritto.", function(done)
        {
          agents.addAgent(mock_agent).subscribe(
					{
            next: (data) => {next(data)},
						error: (err) => {error(error)},
						complete: () => {complete()}
					});
					dynamo_client.put.yield({code:400, msg:"Requested resource not found"});
          expect(error.callCount).to.equal(1);
          expect(error.getCall(0).args[0].statusCode).to.equal(400);
          done();
        });
		    it("Nel caso in cui un agente di api.ai sia aggiunto correttamente, l'\file{Observable} restituito deve chiamare il metodo \file{complete} dell'observer iscritto un'unica volta.", function(done)
				{
					agents.addAgent(mock_agent).subscribe(
					{
            next: (data) => {next(data);},
						error: (err) => {error(error)},
						complete: () => {complete()}
					});
					dynamo_client.put.yield(null, {});
          expect(complete.callCount).to.equal(1);
          done();
				});
      });

      describe('getAgent',function(done)
      {
        it("Nel caso in cui si verifichi un errore nell'interrogazione del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'observer iscritto", function(done)
  			{
  				agents.getAgent('mock_name').subscribe(
          {
            next: (data) => {next(data);},
						error: (err) => {error(error)},
						complete: () => {complete()}
          });
          dynamo_client.get.yield({code:500, msg:"error getting data"});
          expect(error.callCount).to.equal(1);
					expect(error.getCall(0).args[0].statusCode).to.equal(500);
          done();
  			});
        it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'\file{Observable} restituito deve chiamare il metodo \file{next} dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo \file{complete} un'unica volta", function(done)
        {
          let observable = agents.getAgent('mock_name');
          observable.subscribe(
          {
            next: (data) => {next(data);},
						error: (err) => {error(error)},
						complete: () => {complete()}
          });
          dynamo_client.get.yield(null, mock_agent);
          expect(next.callCount).to.be.above(0);
          expect(complete.callCount).to.equal(1);
          done();
        });
      });

      	 describe('getAgentList', function(done)
         {
      		    it("Nel caso in cui un blocco di agenti non venga aggiunto a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function(done)
              {
                agents.getAgentList().subscribe(
                {
                  next: (data) => {next(data);},
      						error: (err) => {error(error)},
      						complete: () => {complete()}
                });
                dynamo_client.get.yield({code:500, msg:"error getting data"});
                expect(error.callCount).to.equal(1);
								expect(error.getCall(0).args[0].statusCode).to.equal(500);
                done();
              });

      		    it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta", function(done)
              {
                agents.getAgentList().subscribe(
                {
                  next: (data) => {next(data);},
      						error: (err) => {error(error)},
      						complete: () => {complete()}
                });
                expect(next.callCount).to.be.above(0);
                expect(complete.callCount).to.equal(1);
                done();
              });
         });

           describe('removeAgent', function(done)
            {
      		    it("Nel caso in cui un agente non venga rimosso a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function(done)
              {
                agents.removeAgent('mock_name').subscribe(
                {
                  next: (data) => {next(data);},
      						error: (err) => {error(error)},
      						complete: () => {complete()}
                });
                dynamo_client.delete.yield({code: 500, msg:"error removing rule"});
                expect(error.callCount).to.equal(1);
								expect(error.getCall(0).args[0].statusCode).to.equal(500);
                done();
              });
      		    it("Nel caso in cui un agente sia rimosso correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.", function(done)
              {
                agents.removeAgent('mock_name').subscribe(
                {
                  next: (data) => {next(data);},
      						error: (err) => {error(error)},
      						complete: () => {complete()}
                });
                dynamo_client.delete.yield(null, {code: 200, msg:"success"});
                expect(complete.callCount).to.equal(1);
                done();
              });
            });

      	  describe('updateAgent', function(done)
          {
      		    it("Nel caso in cui un agente non venga aggiornato a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function(done)
      				{
      					agents.updateAgent('mock_name').subscribe(
      					{
                  next: (data) => {next(data);},
      						error: (err) => {error(error)},
      						complete: () => {complete()}
      					});
      					dynamo_client.update.yield({code: 500, msg:"error updating rule"});
                expect(error.callCount).to.equal(1);
								expect(error.getCall(0).args[0].statusCode).to.equal(500);
                done();
      				});
      		    it("Nel caso in cui un agente sia aggiornato correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.", function(done)
      				{
      					agents.updateAgent('mock_name').subscribe(
      					{
                  next: (data) => {next(data);},
      						error: (err) => {error(error)},
      						complete: () => {complete()}
      					});

      					dynamo_client.update.yield(null, mock_agent);
                expect(next.callCount).to.be.above(0);
                expect(complete.callCount).to.equal(1);
                done();
      				});
           });
    });
  });
});
