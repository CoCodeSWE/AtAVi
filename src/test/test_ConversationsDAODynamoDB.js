const Rx = require('rxjs/Rx');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const dao = require('../Back-end/Conversations/ConversationsDAODynamoDB');
const dynamo_client = require('./stubs/DynamoDB');

describe('Back-end', function(done)
{
  describe('Conversations', function(done)
  {
    describe('ConversationsDAODynamoDB', function(done)
    {
      let conv = new dao(dynamo_client);
      describe('addConversation', function(done)
      {
		it("Nel caso in cui una conversazione non venga aggiunta a causa di un errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.", function(done)
        {
          conv.addConversation().subscribe(
          {
            next: (data) => {done(data);},
            error: (err) => {done();},
            complete: () => {done('complete called');}
          });
          dynamo_client.put.yield({code:500, msg:"error adding data"});
        });
		it("Nel caso in cui una conversazione sia aggiunta correttamente, l'\file{Observable} restituito deve chiamare il metodo \file{complete} dell'\file{Observer} iscritto un'unica volta.");
      });
      describe('addMessage', function(done)
      {
        it("Nel caso in cui un messaggio non venga aggiunta alla conversazione a causa di un errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.", function(done)
        {
          conv.addMessage().subscribe(
          {
            next: (data) => {done(data);},
            error: (err) => {done();},
            complete: () => {done('complete called');}
          });
          dynamo_client.update.yield({code:500, msg:"error adding data"});
        });
        it("Nel caso in cui un messaggio venga aggiunto correttamente alla conversazione, l'\file{Observable} restituito deve chiamare il metodo \file{complete} dell'\file{Observer} iscritto un'unica volta.");
      });
      describe('getConversation', function(done)
      {
        it("Nel caso in cui una conversazione non venga restituita a causa di un errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.", function(done)
        {
          conv.getConversation().subscribe(
          {
            next: (data) => {done(data);},
            error: (err) => {done();},
            complete: () => {done('complete called');}
          });
          dynamo_client.get.yield({code:500, msg:"error downloading data"});
        });
        it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'\file{Observable} restituito deve chiamare il metodo \file{next} dell'\file{Observer} iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo \file{complete} un'unica volta");
      });
      describe('getConversationList', function(done)
      {
        it("Nel caso in cui la lista delle conversazioni non venga restituita a causa di un errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.");
        it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'\file{Observable} restituito deve chiamare il metodo \file{next} dell'\file{Observer} iscritto, fino ad inviare tutte le conversazioni ottenute dall'interrogazione, ed in seguito il metodo \file{complete} un'unica volta");
      });
      describe('removeConversation', function(done)
      {
        it("Nel caso in cui una conversazione non venga eliminata a causa di un errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.");
        it("Nel caso in cui una conversazione sia eliminata correttamente, l'\file{Observable} restituito deve chiamare il metodo \file{complete} dell'\file{Observer} iscritto un'unica volta.");
      });
    });
  });
});
