const Rx = require('rxjs/Rx');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const dao = require('../Back-end/Guests/GuestsDAODynamoDB');
const dynamo_client = require('./stubs/DynamoDB');


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
  describe('Guests', function()
  {
    describe('GuestsDAODynamoDB', function()
    {
      let guests = new dao(dynamo_client);
      describe('addGuest', function()
      {
		    it("Nel caso in cui un ospite non venga aggiunto a causa di un errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.", function()
        {
          guests.addGuest().subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          dynamo_client.put.yield({statusCode:400, message:"Requested resource not found"});
          expect(error.callCount).to.equal(1);
					let callError = error.getCall(0);
					expect(callError.args[0].statusCode).to.equal(400);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);
        });
		    it("Nel caso in cui un ospite sia aggiunto correttamente, l'\file{Observable} restituito deve chiamare il metodo \file{complete} dell'\file{Observer} iscritto un'unica volta.",function()
        {
          guests.addGuest('mauro','Zero12').subscribe(
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
      describe('getGuest', function()
      {
        it("Nel caso in cui un ospite non venga restituito a causa di un errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.", function()
        {
					guests.getGuest('Mauro', 'Zero12').subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          dynamo_client.get.yield({ statusCode : 500, message : "error getting data" });
          expect(error.callCount).to.equal(1);
					let callError = error.getCall(0);
					expect(callError.args[0].statusCode).to.equal(500);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);
				});
        it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'\file{Observable} restituito deve chiamare il metodo \file{next} dell'\file{Observer} iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo \file{complete} un'unica volta",function()
        {
          guests.getGuest('Mauro', 'Zero12').subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          dynamo_client.get.yield(null, { name : "Mauro", company : "Zero12" });
          expect(error.callCount).to.equal(0);
					expect(next.callCount).to.equal(1);
					let callNext = next.getCall(0);
					expect(callNext.args[0]).to.equal({ name : "Mauro", company : "Zero12" });
					expect(complete.callCount).to.equal(1);
        });
      });
      describe('getGuestList', function()
      {
        it("Nel caso in cui un blocco di ospiti non venga restituito a causa di un errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.", function()
        {
          guests.getGuestList().subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });

          dynamo_client.scan.yield(null, {Items: [{ name : "Mauro", company : "Zero12" }], LastEvaluatedKey: 'Piero'});
          dynamo_client.scan.yield(null, {Items: [{ name : "Piero", company : "Google" }], LastEvaluatedKey: 'Luca'});
          dynamo_client.scan.yield({ statusCode : 500 });

          expect(error.callCount).to.equal(1);
          let callError = error.getCall(0);
          expect(callError.args[0].statusCode).to.equal(500);

          expect(next.callCount).to.equal(2);

          let callNext = next.getCall(0);
          expect(callNext.args[0].Items[0].name).to.equal('Mauro');
          expect(callNext.args[0].Items[0].company).to.equal('Zero12');

          callNext = next.getCall(1);
          expect(callNext.args[0].Items[0].name).to.equal('Piero');
          expect(callNext.args[0].Items[0].company).to.equal('Google');

          expect(complete.callCount).to.equal(0);
        });
        it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'\file{Observable} restituito deve chiamare il metodo \file{next} dell'\file{Observer} iscritto, fino ad inviare tutte gli ospiti ottenuti dall'interrogazione, ed in seguito il metodo \file{complete} un'unica volta", function()
        {
          guests.getGuestList().subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });

          dynamo_client.scan.yield(null, {Items: [{ name : "Mauro", company : "Zero12" }], LastEvaluatedKey: 'Piero'});
          dynamo_client.scan.yield(null, {Items: [{ name : "Piero", company : "Google" }], LastEvaluatedKey: 'Luca'});
          dynamo_client.scan.yield({ statusCode : 500 });

          expect(error.callCount).to.equal(1);
          let callError = error.getCall(0);
          expect(callError.args[0].statusCode).to.equal(500);

          expect(error.callCount).to.equal(0);

          expect(next.callCount).to.equal(2);

          expect(callNext.args[0].Items[0].name).to.equal('Mauro');
          expect(callNext.args[0].Items[0].company).to.equal('Zero12');

          callNext = next.getCall(1);
          expect(callNext.args[0].Items[0].name).to.equal('Piero');
          expect(callNext.args[0].Items[0].company).to.equal('Google');

          expect(complete.callCount).to.equal(1);
        });
      });
      describe('removeGuest', function()
      {
        it("Nel caso in cui un ospite non venga eliminato a causa di un errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.", function()
        {
          guests.removeGuest('mou').subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          dynamo_client.delete.yield({ statusCode : 500, message : "error removing guest" });
          expect(error.callCount).to.equal(1);
					let callError = error.getCall(0);
					expect(callError.args[0].statusCode).to.equal(500);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);
        });
        it("Nel caso in cui un ospite sia eliminato correttamente, l'\file{Observable} restituito deve chiamare il metodo \file{complete} dell'\file{Observer} iscritto un'unica volta.",function()
        {
          guests.removeGuest('mou','Zero12').subscribe(
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
      describe('updateGuest', function()
      {
        it("Nel caso in cui un ospite non venga aggiornato a causa di un errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.", function()
        {
          guests.updateGuest('mou').subscribe(
          {
            next: next,
            error: error,
            complete: complete
          });
          dynamo_client.update.yield({statusCode: 500, message:"error updating guest"});
          expect(error.callCount).to.equal(1);
					let callError = error.getCall(0);
					expect(callError.args[0].statusCode).to.equal(500);
					expect(next.callCount).to.equal(0);
					expect(complete.callCount).to.equal(0);
        });
        it("Nel caso in cui un ospite sia aggiornato correttamente, l'\file{Observable} restituito deve chiamare il metodo \file{complete} dell'\file{Observer} iscritto un'unica volta.",function()
        {
          guests.updateGuest('mou','Zero12').subscribe(
          {
            next: (data) =>
            {
              expect(data.name).to.equal("Paolo")
            },
            error: error,
            complete: complete
          });
          dynamo_client.update.yield(null, {});
          expect(error.callCount).to.equal(0);
          expect(complete.callCount).to.equal(1);
        });
      });
    });
  });
});
