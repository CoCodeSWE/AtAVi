const Rx = require('rxjs/Rx');

class ConversationDispatcher {
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

module.exports = CmdDispatcher;
//# sourceMappingURL=Dispatcher.js.map
