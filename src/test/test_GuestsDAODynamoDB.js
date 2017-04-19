const Rx = require('rxjs/Rx');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const dao = require('../Back-end/Guests/GuestsDAODynamoDB');
const dynamo_client = require('./stubs/DynamoDB');

describe('Back-end', function(done)
{
  describe('Guests', function(done)
  {
    describe('GuestsDAODynamoDB', function(done)
    {
      let guests = new dao(dynamo_client);
      describe('addGuest', function(done)
      {
		    it("Nel caso in cui un ospite non venga aggiunto a causa di un errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.", function(done)
        {
          guests.addGuest().subscribe(
          {
            next: (data) => {done(data);},
            error: (err) => {done();},
            complete: () => {done('complete called');}
          });
          dynamo_client.put.yield({ code:500, msg:"error adding guest" });
        });
		    it("Nel caso in cui un ospite sia aggiunto correttamente, l'\file{Observable} restituito deve chiamare il metodo \file{complete} dell'\file{Observer} iscritto un'unica volta.",function(done)
        {
          guests.addGuest('mauro','Zero12').subscribe(
          {
            next: () => {done(data)},
            error: (err) => {done(err)},
            complete: () => {done()}
          });
          dynamo_client.put.yield(null, {});
        });
      });
      describe('getGuest', function(done)
      {
        it("Nel caso in cui un ospite non venga restituito a causa di un errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.", function(done)
        {
					guests.getGuest('mou').subscribe(
          {
            next: (data) => {done(data);},
            error: (err) => {done();},
            complete: () => {done('complete called');}
          });
          dynamo_client.get.yield({code:500, msg:"error getting data"});
				});
        it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'\file{Observable} restituito deve chiamare il metodo \file{next} dell'\file{Observer} iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo \file{complete} un'unica volta",function(done)
        {
          guests.getGuest('Mauro', 'Zero12').subscribe(
          {
            next: (data) =>
            {
              expect(data).to.not.be.null;
              expect(data.name).to.equal("Mauro");
              expect(data.company).to.equal("Zero12");
            },
            error: (err) => {done(err);},
            complete: () => {done();}
          });
          dynamo_client.get.yield(null, {"name": "Mauro", "company": "Zero12"});
        });
      });
      describe('getGuestList', function(done)
      {
        it("Nel caso in cui un blocco di ospiti non venga restituito a causa di un errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.", function(done)
        {
          agents.getGuestList().subscribe(
          {
            next: (data) => {done(data);},
            error: (err) => {done();},
            complete: () => {done('complete called');}
          });
          dynamo_client.get.yield({ code : 500, msg : "error getting data"});
        });
        it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'\file{Observable} restituito deve chiamare il metodo \file{next} dell'\file{Observer} iscritto, fino ad inviare tutte gli ospiti ottenuti dall'interrogazione, ed in seguito il metodo \file{complete} un'unica volta", function(done)
        {
          agents.getGuestList().subscribe(
          {
            next: (data) => { expect(data).to.not.be.null; },
            error: (err) => {done(err);},
            complete: () => {done();}
          });
        });
      });
      describe('removeGuest', function(done)
      {
        it("Nel caso in cui un ospite non venga eliminato a causa di un errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.", function(done)
        {
          guests.removeGuest('mou').subscribe(
          {
            next: (data) => {done(data);},
            error: (err) => {done();},
            complete: () => {done('complete called');}
          });
          dynamo_client.delete.yield({code: 500, msg:"error removing guest"});
        });
        it("Nel caso in cui un ospite sia eliminato correttamente, l'\file{Observable} restituito deve chiamare il metodo \file{complete} dell'\file{Observer} iscritto un'unica volta.",function(done)
        {
          guests.removeGuest('mou','Zero12').subscribe(
          {
            next: () => {done(data)},
            error: (err) => {done(err)},
            complete: () => {done()}
          });
          dynamo_client.delete.yield(null, {code: 200, msg:"success"});
        });
      });
      describe('updateGuest', function(done)
      {
        it("Nel caso in cui un ospite non venga aggiornato a causa di un errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.", function(done)
        {
          guests.updateGuest('mou').subscribe(
          {
            next: (data) => {done(data);},
            error: (err) => {done();},
            complete: () => {done('complete called');}
          });
          dynamo_client.delete.yield({code: 500, msg:"error updating guest"});
        });
        it("Nel caso in cui un ospite sia aggiornato correttamente, l'\file{Observable} restituito deve chiamare il metodo \file{complete} dell'\file{Observer} iscritto un'unica volta.",function(done)
        {
          guests.updateGuest('mou','Zero12').subscribe(
          {
            next: (data) =>
            {
              expect(data.name).to.equal("Paolo")
            },
            error: (err) => {done(err)},
            complete: () => {done()}
          });
          dynamo_client.put.yield(null, {"Attributes": {"name": "Paolo"}});
        });
      });
    });
  });
});
