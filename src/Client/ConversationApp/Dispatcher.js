class CmdDispatcher
{
  constructor()
  {
    this.subject = new Rx.Subject();
  }

  getObservable()
  {
    return this.Subject.asObservable();
  }

  dispatch(cmd, params)
  {
    this.subject.next({cmd: cmd, params: params});
  }
}
