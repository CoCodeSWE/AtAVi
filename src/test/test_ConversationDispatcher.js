const ConversationDispatcher = require('../Client/ConversationApp/Dispatcher.js');
const chai = require('chai');
const expect = chai.expect;

describe('Client', function(done)
{
  describe('ConversationApp', function(done)
  {
    describe('ConversationDispatcher', function(done)
    {
      describe('dispatch', function(done)
      {
        //it('Nel caso in cui i parametri passati non siano corretti, non deve chiamare il metodo dispatcher.dispatch ma sollevare un\'eccezione');
        it("Deve notificare tutti gli observer iscritti, passando loro un oggetto composto dai parametri della chiamata ricevuta");
      });
    });
  });
});
