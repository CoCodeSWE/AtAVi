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
		    it("Nel caso in cui un ospite non venga aggiunto a causa di un errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.");
		    it("Nel caso in cui un ospite sia aggiunto correttamente, l'\file{Observable} restituito deve chiamare il metodo \file{complete} dell'\file{Observer} iscritto un'unica volta.");
      });
      describe('getGuest', function(done)
      {
        it("Nel caso in cui un ospite non venga restituito a causa di un errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.");
        it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'\file{Observable} restituito deve chiamare il metodo \file{next} dell'\file{Observer} iscritto con i dati ottenuti dall'interrogazione, ed in seguito il metodo \file{complete} un'unica volta.");
      });
      describe('getGuestList', function(done)
      {
        it("Nel caso in cui la lista degli ospiti non venga restituita a causa di un errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.");
        it("Nel caso in cui l'interrogazione del DB vada a buon fine, l'\file{Observable} restituito deve chiamare il metodo \file{next} dell'\file{Observer} iscritto, fino ad inviare tutte gli ospiti ottenuti dall'interrogazione, ed in seguito il metodo \file{complete} un'unica volta.");
      });
      describe('removeGuest', function(done)
      {
        it("Nel caso in cui un ospite non venga eliminato a causa di un errore del DB, l'\file{Observable} ritornato deve chiamare il metodo \file{error} dell'\file{Observer} iscritto.");
        it("Nel caso in cui un ospite sia eliminato correttamente, l'\file{Observable} restituito deve chiamare il metodo \file{complete} dell'\file{Observer} iscritto un'unica volta.");
      });
    });
  });
});
