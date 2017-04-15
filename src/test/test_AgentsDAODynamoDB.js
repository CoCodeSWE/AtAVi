const Rx = require('rxjs/Rx');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const dao = require('../Back-end/VirtualAssistant/AgentsDAODynamoDB');
const dynamo_client = require('./stubs/DynamoDB');

describe('Back-end', function(done)
{
  describe('Agents', function(done)
  {
    describe('AgentsDAODynamoDB', function(done){
      let agents = new dao(dynamo_client);
      describe('addAgent', function(done)
      {
		it("Nel caso in cui un agente di api.ai non venga aggiunto a causa di un'errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'observer iscritto.");
		it("Nel caso in cui un agente di api.ai sia aggiunto correttamente, l'\file{Observable} restituito deve chiamare il metodo \file{complete} dell'observer iscritto un'unica volta.");
      });

      describe('getAgent',function(done)
      {
        it("Nel caso in cui si verifichi un errore nell'interrogazione del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'observer iscritto");
        it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'\file{Observable} restituito deve chiamare il metodo \file{next} dell'observer iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo \file{complete} un'unica volta");
      });
    });
  });
});
