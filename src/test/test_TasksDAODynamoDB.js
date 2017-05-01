const Rx = require('rxjs/Rx');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const dao = require('../Back-end/Rules/TasksDAODynamoDB');
const dynamo_client = require('./stubs/DynamoDB');

var mock_task = {Item:{'type':'mock_type'}};
var mock_task2 = {Item:{'type':'mock_type2'}};

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
  describe('Tasks', function()
  {
    describe('TasksDAODynamoDB', function(){
      let tasks = new dao(dynamo_client);
      describe('addTask', function()
      {
		    it("Nel caso in cui la funzione di una direttiva non venga aggiunta a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function()
        {
          tasks.addTask(mock_task).subscribe(
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
		    it("Nel caso in cui la funzione di una direttiva sia aggiunta correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.", function()
				{
					tasks.addTask(mock_task).subscribe(
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

      describe('getTask',function()
      {
        it("Nel caso in cui si verifichi un errore nell'interrogazione del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function()
  			{
  				tasks.getTask('mock_type').subscribe(
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
          let observable = tasks.getTask('mock_type');
          observable.subscribe(
          {
            next: next,
						error: error,
						complete: complete
          });
          dynamo_client.get.yield(null, mock_task);
					expect(error.callCount).to.equal(0);
					expect(next.callCount).to.equal(1);
					let callNext = next.getCall(0);
					expect(callNext.args[0]).to.equal(mock_task.Item);
					expect(complete.callCount).to.equal(1);

        });
      });

	 describe('getTaskList', function()
      {
		    it("Nel caso in cui un blocco di funzioni di direttive non venga aggiunto a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function()
        {
          tasks.getTaskList().subscribe(
          {
            next: next,
						error: error,
						complete: complete
          });
          dynamo_client.scan.yield(null, {Items:[mock_task],LastEvaluatedKey:"mock_type2"});
					dynamo_client.scan.yield(null, {Items:[mock_task2],LastEvaluatedKey:"mock_type3"});
					dynamo_client.scan.yield({statusCode: 500});
					expect(error.callCount).to.equal(1);
					let callError = error.getCall(0);
					expect(callError.args[0].statusCode).to.equal(500);
					expect(next.callCount).to.equal(2);
					let callNext = next.getCall(0);
					expect(callNext.args[0].type).to.equal(mock_task.Item.type);
					callNext = next.getCall(1);
					expect(callNext.args[0].type).to.equal(mock_task2.Item.type);
					expect(complete.callCount).to.equal(0);

        });
		    it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta.", function()
        {
          tasks.getTaskList().subscribe(
          {
            next: next,
						error: error,
						complete: complete
          });
					dynamo_client.scan.yield(null, {Items:[mock_task],LastEvaluatedKey:"mock_type2"});
					dynamo_client.scan.yield(null, {Items:[mock_task2]});
					expect(error.callCount).to.equal(0);
					expect(next.callCount).to.equal(2);
					let callNext = next.getCall(0);
					expect(callNext.args[0].type).to.equal(mock_task.Item.type);
					callNext = next.getCall(1);
					expect(callNext.args[0].type).to.equal(mock_task2.Item.type);
					expect(complete.callCount).to.equal(1);

        });
				it("Nel caso in cui il metodo venga chiamato con queryStringParameters con un solo attributo, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati filtrati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta.", function()
				{
					//da definire
				});
      });

     describe('removeTask', function()
      {
		    it("Nel caso in cui la funzione di una direttiva non venga rimossa a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function()
        {
          tasks.removeTask('mock_type').subscribe(
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
		    it("Nel caso in cui la funzione di una direttiva sia rimossa correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.", function()
        {
          tasks.removeTask('mock_type').subscribe(
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

	  describe('updateTask', function()
      {
		    it("Nel caso in cui la funzione di una direttiva non venga aggiornata a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function()
				{
					tasks.updateTask('mock_type').subscribe(
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

		    it("Nel caso in cui la funzione di una direttiva sia aggiornata correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.", function()
				{
					tasks.updateTask('mock_type').subscribe(
					{
            next: next,
						error: error,
						complete: complete
					});

					dynamo_client.update.yield(null, mock_task);
          expect(error.callCount).to.equal(0);
          expect(complete.callCount).to.equal(1);

					});
				});
      });
    });
  });
