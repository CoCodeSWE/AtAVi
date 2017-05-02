const Rx = require('rxjs/Rx');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const dao = require('../Back-end/Conversations/ConversationsDAODynamoDB');
const dynamo_client = require('./stubs/DynamoDB');

var mock_conv = {Item:{guest:{}, session_id: 1, messages:[{sender:'mock_sender',text: 'mock_text', timestamp: '2000-10-10'}]}};
var mock_conv2 = {Item:{guest:{}, session_id: 2, messages:[{sender:'mock_sender2',text: 'mock_text2', timestamp: '2000-20-20'}]}};

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
  describe('Conversations', function()
  {
    describe('ConversationsDAODynamoDB', function()
    {
      let conv = new dao(dynamo_client);
      describe('addConversation', function()
      {
    		it("Nel caso in cui una conversazione non venga aggiunta a causa di un errore del DB, l'\\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.", function()
        {
          conv.addConversation(mock_conv).subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          dynamo_client.put.yield({ statusCode : 400, message : "Requested resource not found" });
          expect(error.callCount).to.equal(1);
					let callError = error.getCall(0);
					expect(callError.args[0].statusCode).to.equal(400);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);

        });
		    it("Nel caso in cui una conversazione sia aggiunta correttamente, l'\\file{Observable} restituito deve chiamare il metodo \\file{complete} dell'\file{Observer} iscritto un'unica volta.", function()
        {
          conv.addConversation(mock_conv).subscribe(
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
      describe('addMessage', function()
      {
        it("Nel caso in cui un messaggio non venga aggiunta alla conversazione a causa di un errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.", function()
        {
          conv.addMessage({sender:'mock_sender',text: 'mock_text', timestamp: '2000-10-10'},2).subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          dynamo_client.update.yield({ statusCode : 500, message : "error adding message" });
          expect(error.callCount).to.equal(1);
          let callError = error.getCall(0);
          expect(callError.args[0].statusCode).to.equal(500);
          expect(next.callCount).to.equal(0);
          expect(complete.callCount).to.equal(0);
        });
        it("Nel caso in cui un messaggio venga aggiunto correttamente alla conversazione, l'\file{Observable} restituito deve chiamare il metodo \file{complete} dell'\file{Observer} iscritto un'unica volta.", function()
        {
          conv.addMessage({sender:'mock_sender',text: 'mock_text', timestamp: '2000-10-10'},2).subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          dynamo_client.update.yield(null,{});
          expect(error.callCount).to.equal(0);
          expect(complete.callCount).to.equal(1);
        });
      });
      describe('getConversation', function()
      {
        it("Nel caso in cui una conversazione non venga restituita a causa di un errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.", function()
        {
          conv.getConversation(2).subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          dynamo_client.get.yield({ statusCode  :500, message : "error downloading conversation" });
          expect(error.callCount).to.equal(1);
					let callError = error.getCall(0);
					expect(callError.args[0].statusCode).to.equal(500);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);
        });
        it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'\file{Observable} restituito deve chiamare il metodo \file{next} dell'\file{Observer} iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo \file{complete} un'unica volta",function()
        {
          conv.getConversation(2).subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          dynamo_client.get.yield(null, mock_conv);
          expect(error.callCount).to.equal(0);
					expect(next.callCount).to.equal(1);
					let callNext = next.getCall(0);
					expect(callNext.args[0].session_id).to.equal(mock_conv.Item.session_id);
					expect(complete.callCount).to.equal(1);
        });
      });
      describe('getConversationList', function()
      {
        it("Nel caso in cui un blocco di conversazioni non venga restituito a causa di un'errore del DB, l'Observable ritornato deve chiamare il metodo error dell'observer iscritto.", function()
        {
          conv.getConversationList().subscribe(
					{
						next: next,
						error: error,
						complete: complete
					});

          dynamo_client.scan.yield(null, {Items:[mock_conv],LastEvaluatedKey:2});
					dynamo_client.scan.yield(null, {Items:[mock_conv2],LastEvaluatedKey:3});
          dynamo_client.scan.yield({statusCode: 500});
          expect(error.callCount).to.equal(1);
          let callError = error.getCall(0);
          expect(callError.args[0].statusCode).to.equal(500);
          expect(next.callCount).to.equal(2);
          let callNext = next.getCall(0);
          expect(callNext.args[0].session_id).to.equal(mock_conv.Item.session_id);
					callNext = next.getCall(1);
          expect(callNext.args[0].session_id).to.equal(mock_conv2.Item.session_id);
          expect(complete.callCount).to.equal(0);
				});
        it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'\file{Observable} restituito deve chiamare il metodo \file{next} dell'\file{Observer} iscritto, fino ad inviare tutte le conversazioni ottenute dall'interrogazione, ed in seguito il metodo \file{complete} un'unica volta", function()
        {
          conv.getConversationList().subscribe(
  					{
  						next: next,
  						error: error,
  						complete: complete
  					});

            dynamo_client.scan.yield(null, {Items:[mock_conv],LastEvaluatedKey:2});
						dynamo_client.scan.yield(null, {Items:[mock_conv2]});
            expect(error.callCount).to.equal(0);
            expect(next.callCount).to.equal(2);
						let callNext = next.getCall(0);
						expect(callNext.args[0].session_id).to.equal(mock_conv.Item.session_id);
						callNext = next.getCall(1);
						expect(callNext.args[0].session_id).to.equal(mock_conv2.Item.session_id);
            expect(complete.callCount).to.equal(1);
        });
      });
      describe('removeConversation', function()
      {
        it("Nel caso in cui una conversazione non venga eliminata a causa di un errore del DB, l'\\file{Observable} ritornato deve chiamare il metodo \\file{error} dell'\file{Observer} iscritto.", function()
        {
          conv.removeConversation(2).subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          dynamo_client.delete.yield({ statusCode : 500, message : "error removing conversation" });
          expect(error.callCount).to.equal(1);
					let callError = error.getCall(0);
					expect(callError.args[0].statusCode).to.equal(500);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);
        });
        it("Nel caso in cui una conversazione sia eliminata correttamente, l'\\file{Observable} restituito deve chiamare il metodo \\file{complete} dell'\file{Observer} iscritto un'unica volta.",function()
        {
          conv.removeConversation(2).subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          dynamo_client.delete.yield(null, { statusCode : 200, message : "success" });
          expect(error.callCount).to.equal(0);
					expect(complete.callCount).to.equal(1);
        });
      });
    });
  });
});
