const Rx = require('rxjs/Rx');

class MsgStore
{
  constructor()
  {
    this.msgs = [{text:"prova"},{text: "mandato"}];
    this.subject = new Rx.Subject();
  }

  getObservable()
  {
    return this.subject.asObservable();
  }

  onCmd(action)
  {
    switch(action.cmd)
    {
      case 'displayMsgs':
        this.msgs.push({text: action.params[0], sender:0}, {text: action.params[1], sender:1});
        break;
      case 'clear':
        //this.onClear();
        break;
      case 'sendMsg':
      case 'receiveMsg':
      default: return;
    }
    this.subject.next();
  }
}

module.exports = MsgStore;
