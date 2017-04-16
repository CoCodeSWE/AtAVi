const Rx = require('rxjs/Rx');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const dao = require('../Back-end/Rules/TasksDAODynamoDB'); 
const dynamo_client = require('./stubs/DynamoDB');

describe('Back-end', function(done)
{
  describe('Tasks', function(done)
  {
    describe('TasksDAODynamoDB', function(done){
      let tasks = new dao(dynamo_client);
      describe('addTask', function(done)
      {
		    it("Nel caso in cui la funzione di una direttiva non venga aggiunta a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.");
		    it("Nel caso in cui la funzione di una direttiva sia aggiunta correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.");
      });

      describe('getTask',function(done)
      {
        it("Nel caso in cui si verifichi un errore nell'interrogazione del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto");
        it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta");
      });
	  
	 describe('getTaskList', function(done)
      {
		    it("Nel caso in cui un blocco di funzioni di direttive non venga aggiunto a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.");
		    it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta");
      });
	
     describe('removeTask', function(done)
      {
		    it("Nel caso in cui la funzione di una direttiva non venga rimossa a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.");
		    it("Nel caso in cui la funzione di una direttiva sia rimossa correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.");
      });	
	  
	  describe('updateTask', function(done)
      {
		    it("Nel caso in cui la funzione di una direttiva non venga aggiornata a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.");
		    it("Nel caso in cui la funzione di una direttiva sia aggiornata correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.");
      });
	 
    });
  });
});
