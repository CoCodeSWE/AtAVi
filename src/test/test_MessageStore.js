const expect = chai.expect;
var store;

beforeEach(function()
{
  store = new MsgStore();
});

describe('Client', function(done)
{
  describe('ConversationApp', function(done)
  {
    describe('MessageStore', function(done)
    {
      describe('onCmd', function(done)
      {
        //it('Nel caso in cui i parametri passati non siano corretti, non deve chiamare il metodo dispatcher.dispatch ma sollevare un\'eccezione');
        it("se \\file{action.cmd} è uguale a \"clear\", deve essere chiamato il metodo onClear, e devono essere notificati gli observer iscritti al subject di questo store.", function()
        {
          let obs1 = new Observer();
          let obs2 = new Observer();
          store.getObservable().subscribe(obs1);
          store.getObservable().subscribe(obs2);
          store.onCmd({cmd: "clear"});
          expect(obs1.error.notCalled, "error chiamato su obs1").to.be.true;
          expect(obs1.complete.notCalled, "complete chiamato su obs1").to.be.true;
          expect(obs1.next.calledOnce, "next non chiamato un'unica volta su obs1").to.be.true;
          expect(obs2.error.notCalled, "error chiamato su obs2").to.be.true;
          expect(obs2.complete.notCalled, "complete chiamato su obs2").to.be.true;
          expect(obs2.next.calledOnce, "next non chiamato un'unica volta su obs2").to.be.true;
        });
        it("se \\file{action.cmd} è uguale a \"displayMsgs\", deve essere chiamato il metodo onDisplayMsgs, e devono essere notificati gli observer iscritti al subject di questo store.", function()
        {
          let obs1 = new Observer();
          let obs2 = new Observer();
          store.getObservable().subscribe(obs1);
          store.getObservable().subscribe(obs2);
          store.onCmd({cmd: "displayMsgs", params: ["inviato", "ricevuto"]});
          expect(obs1.error.notCalled, "error chiamato su obs1").to.be.true;
          expect(obs1.complete.notCalled, "complete chiamato su obs1").to.be.true;
          expect(obs1.next.calledOnce, "next non chiamato un'unica volta su obs1").to.be.true;
          expect(obs2.error.notCalled, "error chiamato su obs2").to.be.true;
          expect(obs2.complete.notCalled, "complete chiamato su obs2").to.be.true;
          expect(obs2.next.calledOnce, "next non chiamato un'unica volta su obs2").to.be.true;
        });

        it("se \\file{action.cmd} è uguale a \"receiveMsg\", deve essere chiamato il metodo onMsgReceived, e devono essere notificati gli observer iscritti al subject di questo store.", function()
        {
          let obs1 = new Observer();
          let obs2 = new Observer();
          store.getObservable().subscribe(obs1);
          store.getObservable().subscribe(obs2);
          store.onCmd({cmd: "receiveMsg", params: ['messaggio']});
          expect(obs1.error.notCalled, "error chiamato su obs1").to.be.true;
          expect(obs1.complete.notCalled, "complete chiamato su obs1").to.be.true;
          expect(obs1.next.calledOnce, "next non chiamato un'unica volta su obs1").to.be.true;
          expect(obs2.error.notCalled, "error chiamato su obs2").to.be.true;
          expect(obs2.complete.notCalled, "complete chiamato su obs2").to.be.true;
          expect(obs2.next.calledOnce, "next non chiamato un'unica volta su obs2").to.be.true;
        });
        it("se \\file{action.cmd} è uguale a \"sendMsg\", deve essere chiamato il metodo onMsgSent, e devono essere notificati gli observer iscritti al subject di questo store.", function()
        {
          let obs1 = new Observer();
          let obs2 = new Observer();
          store.getObservable().subscribe(obs1);
          store.getObservable().subscribe(obs2);
          store.onCmd({cmd: "sendMsg", params: ["messaggio"]});
          expect(obs1.error.notCalled, "error chiamato su obs1").to.be.true;
          expect(obs1.complete.notCalled, "complete chiamato su obs1").to.be.true;
          expect(obs1.next.calledOnce, "next non chiamato un'unica volta su obs1").to.be.true;
          expect(obs2.error.notCalled, "error chiamato su obs2").to.be.true;
          expect(obs2.complete.notCalled, "complete chiamato su obs2").to.be.true;
          expect(obs2.next.calledOnce, "next non chiamato un'unica volta su obs2").to.be.true;
        });
        it("se \\file{action.cmd} non corrisponde a nessuna delle action prestabilite, non vengano notificati gli observer e non venga sollevata alcuna eccezione.", function()
        {
          let obs1 = new Observer();
          let obs2 = new Observer();
          store.getObservable().subscribe(obs1);
          store.getObservable().subscribe(obs2);
          store.onCmd({cmd: "unsupportedMessage123123", params: ["inviato", "ricevuto"]});
          expect(obs1.error.notCalled, "error chiamato su obs1").to.be.true;
          expect(obs1.complete.notCalled, "complete chiamato su obs1").to.be.true;
          expect(obs1.next.notCalled, "next chiamato su obs1").to.be.true;
          expect(obs2.error.notCalled, "error chiamato su obs2").to.be.true;
          expect(obs2.complete.notCalled, "complete chiamato su obs2").to.be.true;
          expect(obs2.next.notCalled, "next chiamato su obs2").to.be.true;
        });
      });
    });
  });
});
