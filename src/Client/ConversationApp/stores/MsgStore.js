class MsgStore
{
  constructor()
  {
    this.msgs = [];
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
        this._onClear();
        break;
      case 'sendMsg':
        this.msgs.push({text: action.params[0], sender:0});
        console.log("asdadada");
        break;
      case 'receiveMsg':
        this.msgs.push({text: action.params[0], sender:1});
        break;
      default: return;
    }
    this.subject.next();
  }

  _onClear()
  {
    this.msgs = [];
  }

}
