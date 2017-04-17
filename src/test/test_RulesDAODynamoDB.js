
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const dao = require('../Back-end/Rules/RulesDAODynamoDB');
const dynamo_client = require('./stubs/DynamoDB');

var mock_rule = {enabled:true, id:1, name:'testing_rule', targets:[], task:{params:['first','second'], task: 'task_name'}};

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
						next: (data) => {done(data);},
						error: (err) => {done();},
						complete: () => {done('complete called');}
					});
					dynamo_client.put.yield({code:400, msg:"Requested resource not found"});
        });
		    it("Nel caso in cui una direttiva sia aggiunta correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.", function(done)
				{
					rules.addRule(mock_rule).subscribe(
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
     });

      describe('getRule',function(done)
      {
        it("Nel caso in cui si verifichi un errore nell'interrogazione del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto", function(done)
  			{
  				rules.getRule(1).subscribe(
          {
            next: (data) => {done(data);},
            error: (err) => {done();},
            complete: () => {done('complete called');}
          });
          dynamo_client.get.yield({code:500, msg:"error getting data"});
  			});

        it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta", function(done)
        {
          let observable = rules.getRule(1);
          observable.subscribe(
          {
            next: function(data)
            {
              expect(data).to.not.be.null;
              //expect(data.id).to.equal(1);
              //expect(data).to.deep.equal(mock_rule);
            },
            error: (err) => {done(err);},
            complete: () => {done();}
          });
          dynamo_client.get.yield(null, mock_rule);
        });
      });

	 describe('getRuleList', function(done)
   {
		    it("Nel caso in cui un blocco di direttive non venga aggiunto a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function(done)
        {
          rules.getRuleList().subscribe(
          {
            next: (data) => {done(data);},
            error: (err) => {done();},
            complete: () => {done('complete called');}
          });
          dynamo_client.get.yield({code:500, msg:"error getting data"});
        });

		    it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta", function(done)
        {
          rules.getRuleList().subscribe(
          {
            next: (data) => {done(data);},
            error: (err) => {done(err);},
            complete: () => {done();}
          });
        });
     });

     describe('removeRule', function(done)
      {
		    it("Nel caso in cui una direttiva non venga rimossa a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function(done)
        {
          rules.removeRule(1).subscribe(
          {
            next: (data) => {},
            error: () => {done();},
            complete: () => {done('complete called');}
          });
          dynamo_client.delete.yield({code: 500, msg:"error removing rule"});
        });
		    it("Nel caso in cui una direttiva sia rimossa correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.", function(done)
        {
          rules.removeRule(1).subscribe(
          {
            next: (data) => {expect(data).to.not.be.null;}, // controlli di qualche tipo
            error: (err) => {done(err);},
            complete: () => {done();}
          });
          dynamo_client.delete.yield(null, {code: 200, msg:"success"});
        });
      });

	  describe('updateRule', function(done)
    {
		    it("Nel caso in cui una direttiva non venga aggiornata a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function(done)
				{
					rules.updateRule(1).subscribe(
					{
            next: (data) => {done(data);},
            error: (err) => {done();},
            complete: () => {done('complete called');}
					});
					dynamo_client.update.yield({code: 500, msg:"error updating rule"});
				});
		    it("Nel caso in cui una direttiva sia aggiornata correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.", function(done)
				{
					rules.updateRule(1).subscribe(
					{
						next: function(data)
						{
							expect(data).to.not.be.null;
							//expect(data).to.deep.equal(mock_rule);
						},
						error: (err) => {done(err);},
						complete: () => {done();}
					});

					dynamo_client.update.yield(null, mock_rule);
				});
     });
   });
});
