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
	dynamo_client._reset();
});

describe('Back-end', function()
{
	describe('Agents', function()
	{
		describe('AgentsDAODynamoDB', function()
		{
			let agents = new dao(dynamo_client);
			describe('addAgent', function()
			{
				it("Nel caso in cui un agente di api.ai non venga aggiunto a causa di un'errore del DB, l'\\file{Observable} ritornato deve chiamare il metodo \\file{error} dell'observer iscritto.", function()
				{
					agents.addAgent(mock_agent).subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					dynamo_client.put.yield({statusCode:400, msg:"Requested resource not found"});
					expect(error.callCount).to.equal(1);
					expect(error.getCall(0).args[0].statusCode).to.equal(400);
				});
				
				it("Nel caso in cui un agente di api.ai sia aggiunto correttamente, l'\\file{Observable} restituito deve chiamare il metodo \\file{complete} dell'observer iscritto un'unica volta.", function()
				{
					agents.addAgent(mock_agent).subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					dynamo_client.put.yield(null, {});
					expect(complete.callCount).to.equal(1);
				});
			});

			describe('getAgent',function()
			{
				it("Nel caso in cui si verifichi un errore nell'interrogazione del DB, l'\\file{Observable} ritornato deve chiamare il metodo \\file{error} dell'observer iscritto.", function()
				{
					agents.getAgent('mock_name').subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					dynamo_client.get.yield({statusCode:500, msg:"error getting data"});
					expect(error.callCount).to.equal(1);
					expect(error.getCall(0).args[0].statusCode).to.equal(500);
				});
				
				it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'\\file{Observable} restituito deve chiamare il metodo \\file{next} dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo \\file{complete} un'unica volta.", function()
				{
					let observable = agents.getAgent('mock_name');
					observable.subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					dynamo_client.get.yield(null, {Item: {mock_agent}});
					expect(next.callCount).to.be.above(0);
					expect(complete.callCount).to.equal(1);
				});
			});

			describe('getAgentList', function()
			{
				it("Nel caso in cui un blocco di agenti non venga aggiunto a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function()
				{
					agents.getAgentList().subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					dynamo_client.scan.yield(null, {Items: [mock_agent], LastEvaluatedKey: '1'});
					dynamo_client.scan.yield(null, {Items: [mock_agent], LastEvaluatedKey: '2'});
					dynamo_client.scan.yield({statusCode:500, msg:"error getting data"});
					expect(error.callCount).to.equal(1);
					expect(error.getCall(0).args[0].statusCode).to.equal(500);
				});

				it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta.", function()
				{
					agents.getAgentList().subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					dynamo_client.scan.yield(null, {Items: [mock_agent], LastEvaluatedKey: '1'});
					dynamo_client.scan.yield(null, {Items: [mock_agent]}); // Ultimo elemento da ottenere
					expect(next.callCount).to.be.above(0);
					expect(complete.callCount).to.equal(1);
				});
			});

			describe('removeAgent', function()
			{
				it("Nel caso in cui un agente non venga rimosso a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function()
				{
					agents.removeAgent('mock_name').subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					dynamo_client.delete.yield({statusCode: 500, msg:"error removing rule"});
					expect(error.callCount).to.equal(1);
					expect(error.getCall(0).args[0].statusCode).to.equal(500);
				});
				
				it("Nel caso in cui un agente sia rimosso correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.", function()
				{
					agents.removeAgent('mock_name').subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					dynamo_client.delete.yield(null, {statusCode: 200, msg:"success"});
					expect(complete.callCount).to.equal(1);
				});
			});

			describe('updateAgent', function()
			{
				it("Nel caso in cui un agente non venga aggiornato a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function()
				{
					agents.updateAgent('mock_name').subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					dynamo_client.put.yield({statusCode: 500, msg:"error updating rule"});
					expect(error.callCount).to.equal(1);
					expect(error.getCall(0).args[0].statusCode).to.equal(500);
				});
				
				it("Nel caso in cui un agente sia aggiornato correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.", function()
				{
					agents.updateAgent('mock_name').subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					dynamo_client.put.yield(null, mock_agent);
					expect(complete.callCount).to.equal(1);
				});
			});
		});
	});
});
