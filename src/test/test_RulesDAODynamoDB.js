
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
});

describe('Back-end', function(done)
{
  describe('Rules', function(done)
  {
    let rules = new dao(dynamo_client);
    describe('RulesDAODynamoDB', function(done){
      describe('addRule', function(done)
      {
		    it("Nel caso in cui una direttiva non venga aggiunta a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function(done)
        {
          rules.addRule(mock_rule).subscribe(
					{
						next: (data) => {next(data)},
						error: (err) => {error(error)},
						complete: () => {complete()}
					});
					dynamo_client.put.yield({code:400, msg:"Requested resource not found"});
          expect(error.callCount).to.equal(1);
        //  expect(error.getCall(0).args[0].statusCode).to.equal(400);
          done();
        });

		    it("Nel caso in cui una direttiva sia aggiunta correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.", function(done)
				{
					rules.addRule(mock_rule).subscribe(
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
     });

      describe('getRule',function(done)
      {
        it("Nel caso in cui si verifichi un errore nell'interrogazione del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto", function(done)
  			{
  				rules.getRule(1).subscribe(
          {
            next: (data) => {next(data);},
						error: (err) => {error(error)},
						complete: () => {complete()}
          });
          dynamo_client.get.yield({code:500, msg:"error getting data"});
          expect(error.callCount).to.equal(1);
          done();
  			});

        it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta", function(done)
        {
          let observable = rules.getRule(1);
          observable.subscribe(
          {
            next: (data) => {next(data);},
						error: (err) => {error(error)},
						complete: () => {complete()}
          });
          dynamo_client.get.yield(null, mock_rule);
          expect(next.callCount).to.be.above(0);
          expect(complete.callCount).to.equal(1);
          done();
        });
      });

	 describe('getRuleList', function(done)
   {
		    it("Nel caso in cui un blocco di direttive non venga aggiunto a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function(done)
        {
          rules.getRuleList().subscribe(
          {
            next: (data) => {next(data);},
						error: (err) => {error(error)},
						complete: () => {complete()}
          });
          dynamo_client.get.yield({code:500, msg:"error getting data"});
          expect(error.callCount).to.equal(1);
          done();
        });

		    it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta", function(done)
        {
          rules.getRuleList().subscribe(
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

     describe('removeRule', function(done)
      {
		    it("Nel caso in cui una direttiva non venga rimossa a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function(done)
        {
          rules.removeRule(1).subscribe(
          {
            next: (data) => {next(data);},
						error: (err) => {error(error)},
						complete: () => {complete()}
          });
          dynamo_client.delete.yield({code: 500, msg:"error removing rule"});
          expect(error.callCount).to.equal(1);
          done();
        });
		    it("Nel caso in cui una direttiva sia rimossa correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.", function(done)
        {
          rules.removeRule(1).subscribe(
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

	  describe('updateRule', function(done)
    {
		    it("Nel caso in cui una direttiva non venga aggiornata a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function(done)
				{
					rules.updateRule(1).subscribe(
					{
            next: (data) => {next(data);},
						error: (err) => {error(error)},
						complete: () => {complete()}
					});
					dynamo_client.update.yield({code: 500, msg:"error updating rule"});
          expect(error.callCount).to.equal(1);
          done();
				});
		    it("Nel caso in cui una direttiva sia aggiornata correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.", function(done)
				{
					rules.updateRule(1).subscribe(
					{
            next: (data) => {next(data);},
						error: (err) => {error(error)},
						complete: () => {complete()}
					});

					dynamo_client.update.yield(null, mock_rule);
          expect(next.callCount).to.be.above(0);
          expect(complete.callCount).to.equal(1);
          done();
				});
     });
   });
});
