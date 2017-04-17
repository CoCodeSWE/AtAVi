
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const dao = require('../Back-end/VirtualAssistant/AgentsDAODynamoDB');
const dynamo_client = require('./stubs/DynamoDB');

var mock_agent = {lang:'en', name:'mock_name', token:'mock_token'};

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
						next: (data) => {done(data);},
						error: (err) => {done();},
						complete: () => {done('complete called');}
					});
					dynamo_client.put.yield({code:400, msg:"Requested resource not found"});
        });
		    it("Nel caso in cui un agente di api.ai sia aggiunto correttamente, l'\file{Observable} restituito deve chiamare il metodo \file{complete} dell'observer iscritto un'unica volta.", function(done)
				{
					agents.addAgent(mock_agent).subscribe(
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

      describe('getAgent',function(done)
      {
        it("Nel caso in cui si verifichi un errore nell'interrogazione del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'observer iscritto", function(done)
  			{
  				agents.getAgent('mock_name').subscribe(
          {
            next: (data) => {done(data);},
            error: (err) => {done();},
            complete: () => {done('complete called');}
          });
          dynamo_client.get.yield({code:500, msg:"error getting data"});
  			});
        it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'\file{Observable} restituito deve chiamare il metodo \file{next} dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo \file{complete} un'unica volta", function(done)
        {
          let observable = agents.getAgent('mock_name');
          observable.subscribe(
          {
            next: function(data)
            {
              expect(data).to.not.be.null;
              expect(data).to.deep.equal(mock_agent);
            },
            error: (err) => {done(err);},
            complete: () => {done();}
          });
          dynamo_client.get.yield(null, mock_agent);
        });
      });

      	 describe('getAgentList', function(done)
         {
      		    it("Nel caso in cui un blocco di agenti non venga aggiunto a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function(done)
              {
                agents.getAgentList().subscribe(
                {
                  next: (data) => {done(data);},
                  error: (err) => {done();},
                  complete: () => {done('complete called');}
                });
                dynamo_client.get.yield({code:500, msg:"error getting data"});
              });
              
      		    it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'Observable restituito deve chiamare il metodo next dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo complete un'unica volta", function(done)
              {
                agents.getAgentList().subscribe(
                {
                  next: (data) => {expect(data).to.not.be.null;},
                  error: (err) => {done(err);},
                  complete: () => {done();}
                });
              });
         });

           describe('removeAgent', function(done)
            {
      		    it("Nel caso in cui un agente non venga rimosso a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function(done)
              {
                agents.removeAgent('mock_name').subscribe(
                {
                  next: (data) => {},
      						error: () => {done();},
      						complete: () => {done('complete called');}
                });
                dynamo_client.delete.yield({code: 500, msg:"error removing agent"});
              });
      		    it("Nel caso in cui un agente sia rimosso correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.", function(done)
              {
                agents.removeAgent('mock_name').subscribe(
                {
                  next: (data) => {expect(data).to.not.be.null;},
                  error: (err) => {done(err);},
                  complete: () => {done();}
                });
                dynamo_client.delete.yield(null, {code: 200, msg:"success"});
              });
            });

      	  describe('updateAgent', function(done)
          {
      		    it("Nel caso in cui un agente non venga aggiornato a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function(done)
      				{
      					agents.updateAgent('mock_name').subscribe(
      					{
      						next: (data) => {done(data);},
      						error: () => {done();},
      						complete: () => {done('complete called');}
      					});
      					dynamo_client.update.yield({code: 500, msg:"error updating agent"});
      				});
      		    it("Nel caso in cui un agente sia aggiornato correttamente, l'Observable restituito deve chiamare il metodo complete dell'observer iscritto un'unica volta.", function(done)
      				{
      					agents.updateAgent('mock_name').subscribe(
      					{
      						next: function(data)
      						{
      							expect(data).to.not.be.null;
      							expect(data).to.deep.equal(mock_agent);
      						},
      						error: (err) => {done(err);},
      						complete: () => {done();}
      					});

      					dynamo_client.update.yield(null, mock_agent);
      				});
           });
    });
  });
});
