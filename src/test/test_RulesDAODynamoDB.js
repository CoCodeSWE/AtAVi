
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const dao = require('../Back-end/Rules/RulesDAODynamoDB');
const dynamo_client = require('./stubs/DynamoDB');

var mock_rule = {enabled:true, id:1, name:'testing_rule', targets:[], task:{params:['first','second'], task: 'task_name'}};

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
  describe('Rules', function()
  {
    let rules = new dao(dynamo_client);
    describe('RulesDAODynamoDB', function(){
      describe('addRule', function()
      {
		    it("Nel caso in cui una direttiva non venga aggiunta a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function()
        {
          rules.addRule(mock_rule).subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});
					dynamo_client.put.yield({statusCode:400, message:"Requested resource not found"});
          expect(error.callCount).to.equal(1);
					let callError = error.getCall(0);
					expect(callError.args[0].statusCode).to.equal(400);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);

        });

		    it("Nel caso in cui una direttiva sia aggiunta correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.", function()
				{
					rules.addRule(mock_rule).subscribe(
					{
            next: next,
						error: error,
						complete: complete
					});
					dynamo_client.put.yield(null, {});
					expect(error.callCount).to.equal(0);
          expect(complete.callCount).to.equal(1);

				});
      });

      describe('getRule',function()
      {
        it("Nel caso in cui si verifichi un errore nell'interrogazione del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function()
  			{
  				rules.getRule(1).subscribe(
          {
            next: next,
						error: error,
						complete: complete
          });
          dynamo_client.get.yield({statusCode:500, message:"error getting data"});
          expect(error.callCount).to.equal(1);
					let callError = error.getCall(0);
					expect(callError.args[0].statusCode).to.equal(500);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);

  			});

        it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta.", function()
        {
          let observable = rules.getRule(1);
          observable.subscribe(
          {
            next: next,
						error: error,
						complete: complete
          });
          dynamo_client.get.yield(null, mock_rule);
					expect(error.callCount).to.equal(0);
					expect(next.callCount).to.equal(1);
					let callNext = next.getCall(0);
					expect(callNext.args[0]).to.equal(mock_rule);
					expect(complete.callCount).to.equal(1);

        });
      });

	 describe('getRuleList', function()
   {
		    it("Nel caso in cui un blocco di direttive non venga aggiunto a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function()
        {
          rules.getRuleList().subscribe(
          {
            next: next,
						error: error,
						complete: complete
          });
          dynamo_client.scan.yield(null, mock_rule);
					dynamo_client.scan.yield({statusCode: 500});
					expect(error.callCount).to.equal(1);
					let callError = error.getCall(0);
					expect(callError.args[0].statusCode).to.equal(500);

					expect(next.callCount).to.equal(1);

					let callNext = next.getCall(0);
					expect(callNext.args[0].Items[0]).to.equal(mock_rule);
					expect(complete.callCount).to.equal(0);

        });

		    it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta.", function()
        {
          rules.getRuleList().subscribe(
          {
            next: next,
						error: error,
						complete: complete
          });
          dynamo_client.scan.yield(null, mock_rule);
					expect(error.callCount).to.equal(0);
					expect(next.callCount).to.equal(1);
					let callNext = next.getCall(0);
					expect(callNext.args[0].Items[0]).to.equal(mock_rule);
					expect(complete.callCount).to.equal(1);

        });
				it("Nel caso in cui il metodo venga chiamato con queryStringParameters con un solo attributo, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati filtrati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta.", function()
				{
					//da definire
				});
     });

     describe('removeRule', function()
      {
		    it("Nel caso in cui una direttiva non venga rimossa a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function()
        {
          rules.removeRule(1).subscribe(
          {
            next: next,
						error: error,
						complete: complete
          });
          dynamo_client.delete.yield({statusCode: 500, message:"error removing rule"});
					expect(error.callCount).to.equal(1);
					let callError = error.getCall(0);
					expect(callError.args[0].statusCode).to.equal(500);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);

        });
		    it("Nel caso in cui una direttiva sia rimossa correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.", function()
        {
          rules.removeRule(1).subscribe(
          {
            next: next,
						error: error,
						complete: complete
          });
          dynamo_client.delete.yield(null, {statusCode: 200, message:"success"});
					expect(error.callCount).to.equal(0);
          expect(complete.callCount).to.equal(1);

        });
      });

	  describe('updateRule', function()
    {
		    it("Nel caso in cui una direttiva non venga aggiornata a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function()
				{
					rules.updateRule(1).subscribe(
					{
            next: next,
						error: error,
						complete: complete
					});
					dynamo_client.update.yield({statusCode: 500, message:"error updating rule"});
					expect(error.callCount).to.equal(1);
					let callError = error.getCall(0);
					expect(callError.args[0].statusCode).to.equal(500);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);

				});
		    it("Nel caso in cui una direttiva sia aggiornata correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.", function()
				{
					rules.updateRule(1).subscribe(
					{
            next: next,
						error: error,
						complete: complete
					});

					dynamo_client.update.yield(null, {});
          expect(error.callCount).to.equal(0);
          expect(complete.callCount).to.equal(1);

				});
     });
   });
 });
});
