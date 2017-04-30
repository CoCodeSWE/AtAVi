class CmdDispatcher {
  constructor() {
    this.subject = new Rx.Subject();
  }

  getObservable() {
    return this.subject.asObservable();
  }

  dispatch(cmd, params) {
    this.subject.next({ cmd: cmd, params: params });
  }
}
