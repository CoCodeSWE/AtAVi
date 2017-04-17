const Rx = require('rxjs/Rx');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const dao = require('../Back-end/Rules/TasksDAODynamoDB');
const dynamo_client = require('./stubs/DynamoDB');

var mock_task = {type:"mock_type"};

describe('Back-end', function(done)
{
  describe('Tasks', function(done)
  {
    describe('TasksDAODynamoDB', function(done){
      let tasks = new dao(dynamo_client);
      describe('addTask', function(done)
      {
		    it("Nel caso in cui la funzione di una direttiva non venga aggiunta a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function(done)
        {
          tasks.addTask(mock_task).subscribe(
					{
						next: (data) => {done(data);},
						error: (err) => {done();},
						complete: () => {done('complete called');}
					});
					dynamo_client.put.yield({code:400, msg:"Requested resource not found"});
        });
		    it("Nel caso in cui la funzione di una direttiva sia aggiunta correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.", function(done)
				{
					tasks.addTask(mock_task).subscribe(
					{
						next: function(data)
						{
							expect(data).to.not.be.null;
						},
						error: (err) => {done(err)},
						complete: done
					});
					dynamo_client.put.yield(null, {});
				});
      });

      describe('getTask',function(done)
      {
        it("Nel caso in cui si verifichi un errore nell'interrogazione del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto", function(done)
  			{
  				tasks.getTask('mock_type').subscribe(
          {
            next: (data) => {done(data);},
            error: (err) => {done();},
            complete: () => {done('complete called');}
          });
          dynamo_client.get.yield({code:500, msg:"error getting data"});
  			});
        it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta", function(done)
        {
          let observable = tasks.getTask('mock_type');
          observable.subscribe(
          {
            next: function(data)
            {
              expect(data).to.not.be.null;
              expect(data).to.deep.equal(mock_task);
            },
            error: (err) => {done(err);},
            complete: () => {done();}
          });
          dynamo_client.get.yield(null, mock_task);
        });
      });

	 describe('getTaskList', function(done)
      {
		    it("Nel caso in cui un blocco di funzioni di direttive non venga aggiunto a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function(done)
        {
          tasks.getTaskList().subscribe(
          {
            next: (data) => {done(data);},
            error: (err) => {done();},
            complete: () => {done('complete called');}
          });
          dynamo_client.get.yield({code:500, msg:"error getting data"});
        });
		    it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta", function(done)
        {
          tasks.getTaskList().subscribe(
          {
            next: (data) => {expect(data).to.not.be.null;},
            error: (err) => {done(err);},
            complete: () => {done();}
          });
        });
      });

     describe('removeTask', function(done)
      {
		    it("Nel caso in cui la funzione di una direttiva non venga rimossa a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function(done)
        {
          tasks.removeTask('mock_type').subscribe(
          {
            next: (data) => {done(data);},
            error: () => {done();},
            complete: () => {done('complete called');}
          });
          dynamo_client.delete.yield({code: 500, msg:"error removing task"});
        });
		    it("Nel caso in cui la funzione di una direttiva sia rimossa correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.", function(done)
        {
          tasks.removeTask('mock_type').subscribe(
          {
            next: (data) => {done(data);},
            error: (err) => {done(err);},
            complete: () => {done();}
          });
          dynamo_client.delete.yield(null, {code: 200, msg:"success"});
        });
      });

	  describe('updateTask', function(done)
      {
		    it("Nel caso in cui la funzione di una direttiva non venga aggiornata a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function(done)
				{
					tasks.updateTask('mock_type').subscribe(
					{
						next: (data) => {done(data);},
						error: () => {done();},
						complete: () => {done('complete called');}
					});
					dynamo_client.update.yield({code: 500, msg:"error updating task"});
				});
		    it("Nel caso in cui la funzione di una direttiva sia aggiornata correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.", function(done)
				{
					tasks.updateTask('mock_type').subscribe(
					{
						next: function(data)
						{
							expect(data).to.not.be.null;
							expect(data).to.deep.equal(mock_task);
						},
						error: (err) => {done(err);},
						complete: () => {done();}
					});

					dynamo_client.update.yield(null, mock_task);
				});
      });
    });
  });
});
