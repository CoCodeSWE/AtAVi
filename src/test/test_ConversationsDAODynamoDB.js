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
          dynamo_client.put.yield({code:500, msg:"error adding conversation"});
        });
		    it("Nel caso in cui una conversazione sia aggiunta correttamente, l'\file{Observable} restituito deve chiamare il metodo \file{complete} dell'\file{Observer} iscritto un'unica volta.", function(done)
        {
          conv.addConversation('conv').subscribe(
          {
            next: function(data)
            {
              expect(data).to.not.be.null;
            },
            error: (err) => {done(err)},
            complete: () => {done();}
          });
          dynamo_client.put.yield(null, {});
        });
      });
      describe('addMessage', function(done)
      {
        it("Nel caso in cui un messaggio non venga aggiunta alla conversazione a causa di un errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.", function(done)
        {
          conv.addMessage('mess','asd').subscribe(
          {
            next: (data) => {done(data);},
            error: (err) => {done();},
            complete: () => {done('complete called');}
          });
          dynamo_client.update.yield({code:500, msg:"error adding message"});
        });
        it("Nel caso in cui un messaggio venga aggiunto correttamente alla conversazione, l'\file{Observable} restituito deve chiamare il metodo \file{complete} dell'\file{Observer} iscritto un'unica volta.");
      });
      describe('getConversation', function(done)
      {
        it("Nel caso in cui una conversazione non venga restituita a causa di un errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.", function(done)
        {
          conv.getConversation('conv').subscribe(
          {
            next: (data) => {done(data);},
            error: (err) => {done();},
            complete: () => {done('complete called');}
          });
          dynamo_client.get.yield({code:500, msg:"error downloading conversation"});
        });
        it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'\file{Observable} restituito deve chiamare il metodo \file{next} dell'\file{Observer} iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo \file{complete} un'unica volta",function(done)
        {
          let observable = conv.getConversation('conv');
          observable.subscribe(
          {
            next: function(data)
            {
              expect(data).to.not.be.null;
              expect(data.session_id).to.equal('conv');
              expect(data.guest_id).to.equal('mauro');
            },
            error: (err) => {done(err);},
            complete: () => {done();}
          });
          dynamo_client.get.yield(null, {session_id: "conv", guest_id: "mauro"});
        });
      });
      describe('getConversationList', function(done)
      {
        it("Nel caso in cui la lista delle conversazioni non venga restituita a causa di un errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.");
        it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'\file{Observable} restituito deve chiamare il metodo \file{next} dell'\file{Observer} iscritto, fino ad inviare tutte le conversazioni ottenute dall'interrogazione, ed in seguito il metodo \file{complete} un'unica volta");
      });
      describe('removeConversation', function(done)
      {
        it("Nel caso in cui una conversazione non venga eliminata a causa di un errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.", function(done)
        {
          conv.removeConversation('conv').subscribe(
          {
            next: (data) => {done(data);},
            error: (err) => {done();},
            complete: () => {done('complete called');}
          });
          dynamo_client.delete.yield({code: 500, msg:"error removing converstion"});
        });
        it("Nel caso in cui una conversazione sia eliminata correttamente, l'\file{Observable} restituito deve chiamare il metodo \file{complete} dell'\file{Observer} iscritto un'unica volta.");
      });
    });
  });
});
