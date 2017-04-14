const MessageStore = require('../Client/ConversationApp/stores/MsgStore.js');
const chai = require('chai');
const expect = chai.expect;

describe('MessageStore', function(done)
{
  describe('onCmd', function(done)
  {
    //it('Nel caso in cui i parametri passati non siano corretti, non deve chiamare il metodo dispatcher.dispatch ma sollevare un\'eccezione');
    it("se \\file{action.cmd} è uguale a \"clear\", deve essere chiamato il metodo onClear, e devono essere notificati gli observer iscritti al subject di questo store");
    it("se \\file{action.cmd} è uguale a \"displayMsgs\", deve essere chiamato il metodo onDisplayMsgs, e devono essere notificati gli observer iscritti al subject di questo store");
    it("se \\file{action.cmd} è uguale a \"msgReceived\", deve essere chiamato il metodo onMsgReceived, e devono essere notificati gli observer iscritti al subject di questo store");
    it("se \\file{action.cmd} è uguale a \"msgSent\", deve essere chiamato il metodo onMsgSent, e devono essere notificati gli observer iscritti al subject di questo store");
    it("se \\file{action.cmd} non corrisponde a nessuna delle action prestabilite, non vengano notificati gli observer e non venga sollevata alcuna eccezione");
  });
});
