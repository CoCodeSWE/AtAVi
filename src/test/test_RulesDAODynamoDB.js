
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const dao = require('../Back-end/Rules/RulesDAODynamoDB'); 
const dynamo_client = require('./stubs/DynamoDB');

describe('Back-end', function(done)
{
  describe('Rules', function(done)
  {
    describe('RulesDAODynamoDB', function(done){
      let rules = new dao(dynamo_client);
      describe('addRule', function(done)
      {
		    it("Nel caso in cui una direttiva non venga aggiunta a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.");
		    it("Nel caso in cui una direttiva sia aggiunta correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.");
      });

      describe('getRule',function(done)
      {
        it("Nel caso in cui si verifichi un errore nell'interrogazione del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto");
        it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta");
      });
	  
	 describe('getRuleList', function(done)
      {
		    it("Nel caso in cui un blocco di direttive non venga aggiunto a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.");
		    it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta");
      });
	
     describe('removeRule', function(done)
      {
		    it("Nel caso in cui una direttiva non venga rimossa a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.");
		    it("Nel caso in cui una direttiva sia rimossa correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.");
      });	
	  
	  describe('updateRule', function(done)
      {
		    it("Nel caso in cui una direttiva non venga aggiornata a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.");
		    it("Nel caso in cui una direttiva sia aggiornata correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.");
      });
	 
    });
  });
});
