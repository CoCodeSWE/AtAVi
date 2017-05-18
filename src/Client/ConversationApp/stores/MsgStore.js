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
    console.log(action);
    switch(action.cmd)
    {
      case 'displayMsgs':
        action.params.forEach((msg) => this.msgs.push(msg));
        //this.msgs.push({text: action.params[0], sender:0}, {text: action.params[1], sender:1});
        break;
      case 'clear':
        this._onClear();
        break;
      case 'sendMsg':
        this.msgs.push(action.params[0]);
        loadingImage();
        break;
      case 'receiveMsg':
        this.msgs.push(action.params[1]);
        loadingImage();
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
