import Observer from '../browser/observer';
const expect = chai.expect;

let store;
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
        it("Se action.cmd è uguale a \"clear\", deve essere chiamato il metodo onClear, e devono essere notificati gli observer iscritti al subject di questo store.", function()
        {
          let obs1 = new Observer();
          let obs2 = new Observer();
          store.getObservable().subscribe(obs1);
          store.getObservable().subscribe(obs2);
          store.onCmd({cmd: "clear"});
					
          expect(obs1.error.callCount).to.equal(0);
          expect(obs1.complete.callCount).to.equal(0);
          expect(obs1.next.callCount).to.equal(1);
					
          expect(obs2.error.callCount).to.equal(0);
          expect(obs2.complete.callCount).to.equal(0);
          expect(obs2.next.callCount).to.equal(1);
        });
        it("Se action.cmd è uguale a \"displayMsgs\", deve essere chiamato il metodo onDisplayMsgs, e devono essere notificati gli observer iscritti al subject di questo store.", function()
        {
          let obs1 = new Observer();
          let obs2 = new Observer();
          store.getObservable().subscribe(obs1);
          store.getObservable().subscribe(obs2);
          store.onCmd({cmd: "displayMsgs", params: ["inviato", "ricevuto"]});
					
					expect(obs1.error.callCount).to.equal(0);
          expect(obs1.complete.callCount).to.equal(0);
          expect(obs1.next.callCount).to.equal(1);
					
          expect(obs2.error.callCount).to.equal(0);
          expect(obs2.complete.callCount).to.equal(0);
          expect(obs2.next.callCount).to.equal(1);
        });

        it("Se action.cmd è uguale a \"receiveMsg\", deve essere chiamato il metodo onMsgReceived, e devono essere notificati gli observer iscritti al subject di questo store.", function()
        {
          let obs1 = new Observer();
          let obs2 = new Observer();
          store.getObservable().subscribe(obs1);
          store.getObservable().subscribe(obs2);
          store.onCmd({cmd: "receiveMsg", params: ['messaggio']});
					
					expect(obs1.error.callCount).to.equal(0);
          expect(obs1.complete.callCount).to.equal(0);
          expect(obs1.next.callCount).to.equal(1);
					
          expect(obs2.error.callCount).to.equal(0);
          expect(obs2.complete.callCount).to.equal(0);
          expect(obs2.next.callCount).to.equal(1);
        });
        it("Se action.cmd è uguale a \"sendMsg\", deve essere chiamato il metodo onMsgSent, e devono essere notificati gli observer iscritti al subject di questo store.", function()
        {
          let obs1 = new Observer();
          let obs2 = new Observer();
          store.getObservable().subscribe(obs1);
          store.getObservable().subscribe(obs2);
          store.onCmd({cmd: "sendMsg", params: ["messaggio"]});
          
					expect(obs1.error.callCount).to.equal(0);
          expect(obs1.complete.callCount).to.equal(0);
          expect(obs1.next.callCount).to.equal(1);
					
          expect(obs2.error.callCount).to.equal(0);
          expect(obs2.complete.callCount).to.equal(0);
          expect(obs2.next.callCount).to.equal(1);
        });
        it("Se action.cmd non corrisponde a nessuna delle action prestabilite, non vengano notificati gli observer e non venga sollevata alcuna eccezione.", function()
        {
          let obs1 = new Observer();
          let obs2 = new Observer();
          store.getObservable().subscribe(obs1);
          store.getObservable().subscribe(obs2);
          store.onCmd({cmd: "unsupportedMessage123123", params: ["inviato", "ricevuto"]});

					expect(obs1.error.callCount).to.equal(0);
          expect(obs1.complete.callCount).to.equal(0);
          expect(obs1.next.callCount).to.equal(0);
					
          expect(obs2.error.callCount).to.equal(0);
          expect(obs2.complete.callCount).to.equal(0);
          expect(obs2.next.callCount).to.equal(0);
        });
      });
    });
  });
});
